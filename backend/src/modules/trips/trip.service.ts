import { Prisma, Trip, Vehicle, Driver } from '@prisma/client';
import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import { CreateTripInput, CompleteTripInput, TripQuery } from './trip.schema';

// ─── Guard Functions (named business rules) ────────────────────────────────────

function assertVehicleAvailableForDispatch(vehicle: Vehicle): void {
  if (vehicle.status !== 'AVAILABLE') {
    throw new AppError(
      `Vehicle ${vehicle.registrationNumber} is not available (current status: ${vehicle.status})`,
      409,
      'VEHICLE_NOT_AVAILABLE'
    );
  }
}

function assertDriverAvailableForDispatch(driver: Driver): void {
  if (driver.status !== 'AVAILABLE') {
    throw new AppError(
      `Driver ${driver.name} is not available (current status: ${driver.status})`,
      409,
      'DRIVER_NOT_AVAILABLE'
    );
  }
  if (driver.licenseExpiryDate <= new Date()) {
    throw new AppError(
      `Driver ${driver.name}'s license expired on ${driver.licenseExpiryDate.toISOString().slice(0, 10)}`,
      422,
      'LICENSE_EXPIRED'
    );
  }
}

function assertCargoFitsVehicle(cargoKg: Prisma.Decimal, vehicle: Vehicle): void {
  if (cargoKg.greaterThan(vehicle.maxLoadCapacityKg)) {
    // Explicit numbers in the message — this is the "money shot" error on Screen 4
    throw new AppError(
      `Cargo ${cargoKg}kg exceeds vehicle capacity ${vehicle.maxLoadCapacityKg}kg`,
      422,
      'CARGO_EXCEEDS_CAPACITY'
    );
  }
}

function assertTripInStatus(trip: Trip, allowed: Trip['status'][], action: string): void {
  if (!allowed.includes(trip.status)) {
    throw new AppError(
      `Cannot ${action} a trip that is ${trip.status}`,
      409,
      'INVALID_TRIP_TRANSITION'
    );
  }
}

// ─── Service Functions ─────────────────────────────────────────────────────────

export async function listTrips(query: TripQuery) {
  const { status, vehicleId, driverId, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TripWhereInput = {
    ...(status && { status }),
    ...(vehicleId && { vehicleId }),
    ...(driverId && { driverId }),
  };

  const [trips, total] = await db.$transaction([
    db.trip.findMany({
      where,
      select: {
        id: true,
        origin: true,
        destination: true,
        cargoWeightKg: true,
        plannedDistanceKm: true,
        revenue: true,
        status: true,
        scheduledAt: true,
        dispatchedAt: true,
        completedAt: true,
        vehicle: { select: { id: true, registrationNumber: true, make: true, model: true } },
        driver: { select: { id: true, name: true, licenseNumber: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.trip.count({ where }),
  ]);

  return { trips, total };
}

export async function getTrip(id: string) {
  const trip = await db.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, licenseNumber: true, licenseCategory: true } },
      fuelLogs: { orderBy: { loggedAt: 'desc' } },
    },
  });
  if (!trip) throw new AppError('Trip not found', 404, 'NOT_FOUND');
  return trip;
}

export async function createTrip(input: CreateTripInput) {
  const cargoKg = new Prisma.Decimal(input.cargoWeightKg);

  // Pre-flight checks before writing anything
  const vehicle = await db.vehicle.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
  assertCargoFitsVehicle(cargoKg, vehicle);

  const driver = await db.driver.findUnique({ where: { id: input.driverId } });
  if (!driver) throw new AppError('Driver not found', 404, 'NOT_FOUND');

  return db.trip.create({
    data: {
      vehicleId: input.vehicleId,
      driverId: input.driverId,
      origin: input.origin,
      destination: input.destination,
      cargoWeightKg: cargoKg,
      plannedDistanceKm: new Prisma.Decimal(input.plannedDistanceKm),
      revenue: new Prisma.Decimal(input.revenue),
      scheduledAt: new Date(input.scheduledAt),
      notes: input.notes,
      status: 'DRAFT',
    },
    select: { id: true, status: true, origin: true, destination: true, scheduledAt: true },
  });
}

export async function dispatchTrip(tripId: string) {
  // Interactive transaction: re-read all statuses inside the transaction to close
  // the race window where two rapid dispatch calls could both succeed.
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new AppError('Trip not found', 404, 'NOT_FOUND');
    assertTripInStatus(trip, ['DRAFT'], 'dispatch');

    const vehicle = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });
    if (!vehicle) throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    assertVehicleAvailableForDispatch(vehicle);
    assertCargoFitsVehicle(trip.cargoWeightKg, vehicle);

    const driver = await tx.driver.findUnique({ where: { id: trip.driverId } });
    if (!driver) throw new AppError('Driver not found', 404, 'NOT_FOUND');
    assertDriverAvailableForDispatch(driver);

    // All three writes in one atomic operation — all succeed or none do
    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id: tripId },
        data: {
          status: 'DISPATCHED',
          dispatchedAt: new Date(),
          startOdometerKm: vehicle.currentOdometerKm,
        },
      }),
      tx.vehicle.update({ where: { id: vehicle.id }, data: { status: 'ON_TRIP' } }),
      tx.driver.update({ where: { id: driver.id }, data: { status: 'ON_TRIP' } }),
    ]);

    return updatedTrip;
  });
}

export async function completeTrip(tripId: string, input: CompleteTripInput) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new AppError('Trip not found', 404, 'NOT_FOUND');
    assertTripInStatus(trip, ['DISPATCHED'], 'complete');

    const finalOdometer = new Prisma.Decimal(input.finalOdometerKm);
    const fuelCost = new Prisma.Decimal(input.fuelLiters).times(new Prisma.Decimal(input.pricePerLiter));

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id: tripId },
        data: { status: 'COMPLETED', completedAt: new Date(), finalOdometerKm: finalOdometer },
      }),
      // Restore vehicle to AVAILABLE and update odometer in one write
      tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE', currentOdometerKm: finalOdometer },
      }),
      tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } }),
      // FuelLog is the single source of truth for fuel — no liters stored on Trip
      tx.fuelLog.create({
        data: {
          vehicleId: trip.vehicleId,
          tripId: trip.id,
          liters: new Prisma.Decimal(input.fuelLiters),
          pricePerLiter: new Prisma.Decimal(input.pricePerLiter),
          totalCost: fuelCost,
          odometer: finalOdometer,
        },
      }),
    ]);

    return updatedTrip;
  });
}

export async function cancelTrip(tripId: string) {
  return db.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new AppError('Trip not found', 404, 'NOT_FOUND');

    // DRAFT → CANCELLED: no vehicle/driver to restore (they were never flipped to ON_TRIP)
    // DISPATCHED → CANCELLED: restore vehicle and driver
    assertTripInStatus(trip, ['DRAFT', 'DISPATCHED'], 'cancel');

    const updates: Promise<unknown>[] = [
      tx.trip.update({ where: { id: tripId }, data: { status: 'CANCELLED', cancelledAt: new Date() } }),
    ];

    if (trip.status === 'DISPATCHED') {
      updates.push(
        tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } }),
        tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } })
      );
    }

    const [updatedTrip] = await Promise.all(updates);
    return updatedTrip;
  });
}
