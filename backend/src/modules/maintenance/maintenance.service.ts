import { Prisma } from '@prisma/client';
import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import { CreateMaintenanceInput, MaintenanceQuery } from './maintenance.schema';

export async function listMaintenanceLogs(query: MaintenanceQuery) {
  const { vehicleId, status, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MaintenanceLogWhereInput = {
    ...(vehicleId && { vehicleId }),
    ...(status && { status }),
  };

  const [logs, total] = await db.$transaction([
    db.maintenanceLog.findMany({
      where,
      include: { vehicle: { select: { id: true, registrationNumber: true, make: true, model: true } } },
      skip,
      take: limit,
      orderBy: { openedAt: 'desc' },
    }),
    db.maintenanceLog.count({ where }),
  ]);

  return { logs, total };
}

export async function createMaintenanceLog(input: CreateMaintenanceInput) {
  // Opening a maintenance record immediately puts the vehicle IN_SHOP — transactionally
  return db.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) throw new AppError('Vehicle not found', 404, 'NOT_FOUND');

    if (vehicle.status === 'RETIRED') {
      throw new AppError(
        `Vehicle ${vehicle.registrationNumber} is RETIRED and cannot receive maintenance records`,
        409,
        'VEHICLE_RETIRED'
      );
    }

    const [log] = await Promise.all([
      tx.maintenanceLog.create({
        data: {
          vehicleId: input.vehicleId,
          description: input.description,
          cost: new Prisma.Decimal(input.cost),
        },
      }),
      tx.vehicle.update({ where: { id: input.vehicleId }, data: { status: 'IN_SHOP' } }),
    ]);

    return log;
  });
}

export async function closeMaintenanceLog(id: string) {
  return db.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.findUnique({
      where: { id },
      include: { vehicle: { select: { id: true, status: true, registrationNumber: true } } },
    });
    if (!log) throw new AppError('Maintenance log not found', 404, 'NOT_FOUND');
    if (log.status === 'CLOSED') {
      throw new AppError('Maintenance log is already closed', 409, 'ALREADY_CLOSED');
    }

    const updates: Promise<unknown>[] = [
      tx.maintenanceLog.update({
        where: { id },
        data: { status: 'CLOSED', closedAt: new Date() },
      }),
    ];

    // Only restore to AVAILABLE if not RETIRED — don't blindly overwrite status
    if (log.vehicle.status !== 'RETIRED') {
      updates.push(
        tx.vehicle.update({ where: { id: log.vehicle.id }, data: { status: 'AVAILABLE' } })
      );
    }

    const [updatedLog] = await Promise.all(updates);
    return updatedLog;
  });
}
