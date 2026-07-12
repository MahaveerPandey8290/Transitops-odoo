import { Prisma } from '@prisma/client';
import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import { CreateDriverInput, UpdateDriverInput, DriverQuery } from './driver.schema';

const driverListSelect = {
  id: true,
  name: true,
  licenseNumber: true,
  licenseCategory: true,
  licenseExpiryDate: true,
  phone: true,
  safetyScore: true,
  status: true,
  region: true,
} satisfies Prisma.DriverSelect;

export async function listDrivers(query: DriverQuery) {
  const { status, region, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.DriverWhereInput = {
    ...(status && { status }),
    ...(region && { region: { contains: region, mode: 'insensitive' } }),
  };

  const [drivers, total] = await db.$transaction([
    db.driver.findMany({
      where,
      select: {
        ...driverListSelect,
        // Compute trip completion ratio inline: completed trips / total assigned trips
        _count: { select: { trips: true } },
        trips: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    db.driver.count({ where }),
  ]);

  // Shape the completion ratio into a flat field for the frontend table
  const driversWithCompletion = drivers.map(({ trips, _count, ...driver }) => ({
    ...driver,
    totalTrips: _count.trips,
    completedTrips: trips.length,
    tripCompletionRate:
      _count.trips > 0 ? Math.round((trips.length / _count.trips) * 100) : 0,
  }));

  return { drivers: driversWithCompletion, total };
}

// Available drivers: status AVAILABLE + non-expired license — both filters at DB level
export async function listAvailableDrivers() {
  return db.driver.findMany({
    where: {
      status: 'AVAILABLE',
      licenseExpiryDate: { gt: new Date() },
    },
    select: driverListSelect,
    orderBy: { name: 'asc' },
  });
}

export async function getDriver(id: string) {
  const driver = await db.driver.findUnique({
    where: { id },
    include: { _count: { select: { trips: true } } },
  });
  if (!driver) throw new AppError('Driver not found', 404, 'NOT_FOUND');
  return driver;
}

export async function createDriver(input: CreateDriverInput) {
  return db.driver.create({
    data: {
      ...input,
      licenseExpiryDate: new Date(input.licenseExpiryDate),
    },
    select: { id: true, name: true, licenseNumber: true, status: true },
  });
}

export async function updateDriver(id: string, input: UpdateDriverInput) {
  await getDriver(id);

  const data: Prisma.DriverUpdateInput = { ...input };
  if (input.licenseExpiryDate) data.licenseExpiryDate = new Date(input.licenseExpiryDate);

  return db.driver.update({ where: { id }, data });
}
