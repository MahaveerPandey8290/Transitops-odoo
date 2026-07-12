import { Prisma } from '@prisma/client';
import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import { CreateVehicleInput, UpdateVehicleInput, VehicleQuery } from './vehicle.schema';

// Only these fields are returned on list endpoints — never SELECT *
const vehicleListSelect = {
  id: true,
  registrationNumber: true,
  make: true,
  model: true,
  year: true,
  type: true,
  status: true,
  region: true,
  maxLoadCapacityKg: true,
  currentOdometerKm: true,
} satisfies Prisma.VehicleSelect;

export async function listVehicles(query: VehicleQuery) {
  const { status, type, region, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.VehicleWhereInput = {
    ...(status && { status }),
    ...(type && { type }),
    ...(region && { region: { contains: region, mode: 'insensitive' } }),
  };

  const [vehicles, total] = await db.$transaction([
    db.vehicle.findMany({ where, select: vehicleListSelect, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    db.vehicle.count({ where }),
  ]);

  return { vehicles, total };
}

// Used by the Trip Dispatcher — Retired and In Shop excluded at query level
export async function listAvailableVehicles() {
  return db.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    select: vehicleListSelect,
    orderBy: { registrationNumber: 'asc' },
  });
}

export async function getVehicle(id: string) {
  const vehicle = await db.vehicle.findUnique({
    where: { id },
    include: {
      _count: { select: { trips: true, maintenanceLogs: true, fuelLogs: true } },
    },
  });
  if (!vehicle) throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
  return vehicle;
}

export async function createVehicle(input: CreateVehicleInput) {
  return db.vehicle.create({
    data: {
      ...input,
      maxLoadCapacityKg: new Prisma.Decimal(input.maxLoadCapacityKg),
      currentOdometerKm: new Prisma.Decimal(input.currentOdometerKm ?? 0),
      purchaseCost: new Prisma.Decimal(input.purchaseCost),
    },
    select: { id: true, registrationNumber: true, make: true, model: true, status: true },
  });
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  await getVehicle(id); // ensure exists before updating

  const data: Prisma.VehicleUpdateInput = { ...input };
  if (input.maxLoadCapacityKg !== undefined) data.maxLoadCapacityKg = new Prisma.Decimal(input.maxLoadCapacityKg);
  if (input.purchaseCost !== undefined) data.purchaseCost = new Prisma.Decimal(input.purchaseCost);
  if (input.currentOdometerKm !== undefined) data.currentOdometerKm = new Prisma.Decimal(input.currentOdometerKm);

  return db.vehicle.update({ where: { id }, data });
}
