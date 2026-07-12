import { Prisma } from '@prisma/client';
import db from '../../config/db';

// ─── Dashboard KPIs ────────────────────────────────────────────────────────────

export async function getDashboardKpis() {
  // Count vehicles by status in one aggregation query
  const vehicleStatusCounts = await db.vehicle.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const vehicleCounts = { AVAILABLE: 0, ON_TRIP: 0, IN_SHOP: 0, RETIRED: 0 };
  for (const row of vehicleStatusCounts) {
    vehicleCounts[row.status] = row._count.id;
  }

  const activeVehicles = vehicleCounts.AVAILABLE + vehicleCounts.ON_TRIP + vehicleCounts.IN_SHOP;

  // Fleet utilization: ON_TRIP ÷ deployable (AVAILABLE + ON_TRIP)
  const deployable = vehicleCounts.AVAILABLE + vehicleCounts.ON_TRIP;
  const fleetUtilizationPct =
    deployable > 0 ? Math.round((vehicleCounts.ON_TRIP / deployable) * 100) : 0;

  // Trip counts by status
  const tripStatusCounts = await db.trip.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const tripCounts = { DRAFT: 0, DISPATCHED: 0, COMPLETED: 0, CANCELLED: 0 };
  for (const row of tripStatusCounts) {
    tripCounts[row.status] = row._count.id;
  }

  // Drivers on duty: AVAILABLE + ON_TRIP (not OFF_DUTY or SUSPENDED)
  const driverStatusCounts = await db.driver.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const driverCounts = { AVAILABLE: 0, ON_TRIP: 0, OFF_DUTY: 0, SUSPENDED: 0 };
  for (const row of driverStatusCounts) {
    driverCounts[row.status] = row._count.id;
  }

  const driversOnDuty = driverCounts.AVAILABLE + driverCounts.ON_TRIP;

  return {
    vehicles: {
      active: activeVehicles,
      available: vehicleCounts.AVAILABLE,
      onTrip: vehicleCounts.ON_TRIP,
      inMaintenance: vehicleCounts.IN_SHOP,
      retired: vehicleCounts.RETIRED,
    },
    trips: {
      active: tripCounts.DISPATCHED,
      pending: tripCounts.DRAFT,
      completed: tripCounts.COMPLETED,
      cancelled: tripCounts.CANCELLED,
    },
    drivers: {
      onDuty: driversOnDuty,
      onTrip: driverCounts.ON_TRIP,
      available: driverCounts.AVAILABLE,
      offDuty: driverCounts.OFF_DUTY,
      suspended: driverCounts.SUSPENDED,
    },
    fleetUtilizationPct,
  };
}

// ─── Fuel Efficiency Report ────────────────────────────────────────────────────
// km per liter per vehicle, computed from completed trip odometer deltas + linked fuel logs

export async function getFuelEfficiencyReport() {
  const results = await db.$queryRaw<
    { vehicleId: string; registration: string; make: string; model: string; totalKm: number; totalLiters: number; kmPerLiter: number; tripCount: number }[]
  >(Prisma.sql`
    SELECT
      v.id             AS "vehicleId",
      v."registrationNumber" AS registration,
      v.make,
      v.model,
      COALESCE(SUM(t."finalOdometerKm" - t."startOdometerKm"), 0)::float AS "totalKm",
      COALESCE(SUM(fl.liters), 0)::float                                  AS "totalLiters",
      CASE WHEN COALESCE(SUM(fl.liters), 0) = 0 THEN 0
           ELSE ROUND((SUM(t."finalOdometerKm" - t."startOdometerKm") / SUM(fl.liters))::numeric, 2)::float
      END AS "kmPerLiter",
      COUNT(DISTINCT t.id)::int AS "tripCount"
    FROM "Vehicle" v
    LEFT JOIN "Trip"    t  ON t."vehicleId" = v.id AND t.status = 'COMPLETED'
                           AND t."startOdometerKm" IS NOT NULL
                           AND t."finalOdometerKm" IS NOT NULL
    LEFT JOIN "FuelLog" fl ON fl."vehicleId" = v.id AND fl."tripId" = t.id
    GROUP BY v.id, v."registrationNumber", v.make, v.model
    ORDER BY "kmPerLiter" DESC
  `);

  return results;
}

// ─── Fleet Utilization Report ──────────────────────────────────────────────────

export async function getFleetUtilizationReport() {
  const results = await db.$queryRaw<
    { vehicleId: string; registration: string; type: string; region: string; totalTrips: number; completedTrips: number; utilizationPct: number }[]
  >(Prisma.sql`
    SELECT
      v.id             AS "vehicleId",
      v."registrationNumber" AS registration,
      v.type::text,
      v.region,
      COUNT(t.id)::int                                        AS "totalTrips",
      COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END)::int AS "completedTrips",
      CASE WHEN COUNT(t.id) = 0 THEN 0
           ELSE ROUND((COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END)::numeric / COUNT(t.id) * 100), 1)::float
      END AS "utilizationPct"
    FROM "Vehicle" v
    LEFT JOIN "Trip" t ON t."vehicleId" = v.id
    GROUP BY v.id, v."registrationNumber", v.type, v.region
    ORDER BY "completedTrips" DESC
  `);

  return results;
}

// ─── Operational Cost Report ───────────────────────────────────────────────────
// Operational cost = Fuel + Maintenance (per spec §3.7 — expenses shown separately)

export async function getOperationalCostReport() {
  const results = await db.$queryRaw<
    { vehicleId: string; registration: string; fuelCost: number; maintenanceCost: number; operationalCost: number; expenseCost: number }[]
  >(Prisma.sql`
    SELECT
      v.id             AS "vehicleId",
      v."registrationNumber" AS registration,
      COALESCE(SUM(fl."totalCost"), 0)::float  AS "fuelCost",
      COALESCE(SUM(ml.cost), 0)::float          AS "maintenanceCost",
      (COALESCE(SUM(fl."totalCost"), 0) + COALESCE(SUM(ml.cost), 0))::float AS "operationalCost",
      COALESCE(SUM(ex.amount), 0)::float        AS "expenseCost"
    FROM "Vehicle" v
    LEFT JOIN "FuelLog"        fl ON fl."vehicleId" = v.id
    LEFT JOIN "MaintenanceLog" ml ON ml."vehicleId" = v.id
    LEFT JOIN "Expense"        ex ON ex."vehicleId" = v.id
    GROUP BY v.id, v."registrationNumber"
    ORDER BY "operationalCost" DESC
  `);

  return results;
}

// ─── Vehicle ROI Report ────────────────────────────────────────────────────────
// ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost (per spec formula)

export async function getVehicleRoiReport() {
  const results = await db.$queryRaw<
    { vehicleId: string; registration: string; revenue: number; fuelCost: number; maintenanceCost: number; acquisitionCost: number; roi: number }[]
  >(Prisma.sql`
    SELECT
      v.id             AS "vehicleId",
      v."registrationNumber" AS registration,
      COALESCE(SUM(t.revenue), 0)::float        AS revenue,
      COALESCE(SUM(fl."totalCost"), 0)::float   AS "fuelCost",
      COALESCE(SUM(ml.cost), 0)::float          AS "maintenanceCost",
      v."purchaseCost"::float                   AS "acquisitionCost",
      CASE WHEN v."purchaseCost" = 0 THEN 0
           ELSE ROUND(
             ((COALESCE(SUM(t.revenue), 0) - COALESCE(SUM(fl."totalCost"), 0) - COALESCE(SUM(ml.cost), 0))
              / v."purchaseCost" * 100)::numeric,
             2
           )::float
      END AS roi
    FROM "Vehicle" v
    LEFT JOIN "Trip"           t  ON t."vehicleId" = v.id AND t.status = 'COMPLETED'
    LEFT JOIN "FuelLog"        fl ON fl."vehicleId" = v.id
    LEFT JOIN "MaintenanceLog" ml ON ml."vehicleId" = v.id
    GROUP BY v.id, v."registrationNumber", v."purchaseCost"
    ORDER BY roi DESC
  `);

  return results;
}

// ─── CSV Export ────────────────────────────────────────────────────────────────

export async function buildCsvExport(): Promise<string> {
  const rows = await getOperationalCostReport();
  const header = 'vehicleId,registration,fuelCost,maintenanceCost,operationalCost,expenseCost';
  const lines = rows.map(
    (r) =>
      `${r.vehicleId},${r.registration},${r.fuelCost},${r.maintenanceCost},${r.operationalCost},${r.expenseCost}`
  );
  return [header, ...lines].join('\n');
}
