import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

// Seed credentials — printed to console at the end, not hardcoded silently
const seedUsers = [
  { name: 'Alex Fleet',    email: 'fleet@transitsops.dev',    password: 'Fleet@2026!',    role: 'FLEET_MANAGER'     as const },
  { name: 'Dana Dispatch', email: 'dispatch@transitsops.dev', password: 'Dispatch@2026!', role: 'DISPATCHER'        as const },
  { name: 'Sam Safety',    email: 'safety@transitsops.dev',   password: 'Safety@2026!',   role: 'SAFETY_OFFICER'    as const },
  { name: 'Fay Finance',   email: 'finance@transitsops.dev',  password: 'Finance@2026!',  role: 'FINANCIAL_ANALYST' as const },
];

async function main() {
  console.log('🌱  Seeding TransitOps database...\n');

  // ─── Users ──────────────────────────────────────────────────────────────────
  const createdUsers = [];
  for (const u of seedUsers) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    const user = await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, passwordHash, name: u.name, role: u.role },
    });
    createdUsers.push({ ...u, id: user.id });
  }

  // ─── Vehicles ───────────────────────────────────────────────────────────────
  const vehicles = await Promise.all([
    db.vehicle.upsert({
      where: { registrationNumber: 'TRN-001' },
      update: {},
      create: {
        registrationNumber: 'TRN-001', make: 'Tata', model: 'Ace Gold', year: 2022,
        type: 'TRUCK', status: 'AVAILABLE', region: 'North',
        maxLoadCapacityKg: new Prisma.Decimal(5000), currentOdometerKm: new Prisma.Decimal(12400),
        purchaseCost: new Prisma.Decimal(850000),
      },
    }),
    db.vehicle.upsert({
      where: { registrationNumber: 'TRN-002' },
      update: {},
      create: {
        registrationNumber: 'TRN-002', make: 'Ashok Leyland', model: 'Boss', year: 2021,
        type: 'TRUCK', status: 'AVAILABLE', region: 'South',
        maxLoadCapacityKg: new Prisma.Decimal(8000), currentOdometerKm: new Prisma.Decimal(34200),
        purchaseCost: new Prisma.Decimal(1200000),
      },
    }),
    db.vehicle.upsert({
      where: { registrationNumber: 'TRN-003' },
      update: {},
      create: {
        registrationNumber: 'TRN-003', make: 'Mahindra', model: 'Supro Van', year: 2023,
        type: 'VAN', status: 'ON_TRIP', region: 'West',
        maxLoadCapacityKg: new Prisma.Decimal(750), currentOdometerKm: new Prisma.Decimal(8900),
        purchaseCost: new Prisma.Decimal(620000),
      },
    }),
    db.vehicle.upsert({
      where: { registrationNumber: 'TRN-004' },
      update: {},
      create: {
        registrationNumber: 'TRN-004', make: 'Eicher', model: 'Pro 2049', year: 2020,
        type: 'TRUCK', status: 'IN_SHOP', region: 'East',
        maxLoadCapacityKg: new Prisma.Decimal(4900), currentOdometerKm: new Prisma.Decimal(67800),
        purchaseCost: new Prisma.Decimal(980000),
      },
    }),
    db.vehicle.upsert({
      where: { registrationNumber: 'TRN-005' },
      update: {},
      create: {
        registrationNumber: 'TRN-005', make: 'Force', model: 'Traveller', year: 2018,
        type: 'BUS', status: 'RETIRED', region: 'North',
        maxLoadCapacityKg: new Prisma.Decimal(2000), currentOdometerKm: new Prisma.Decimal(210000),
        purchaseCost: new Prisma.Decimal(700000),
      },
    }),
  ]);

  // ─── Drivers ────────────────────────────────────────────────────────────────
  const drivers = await Promise.all([
    db.driver.upsert({
      where: { licenseNumber: 'DL-2201-00001' },
      update: {},
      create: {
        name: 'Ravi Kumar',     licenseNumber: 'DL-2201-00001',
        licenseCategory: 'HMV', licenseExpiryDate: new Date('2028-06-30'),
        phone: '+91-9876540001', safetyScore: 94, status: 'AVAILABLE', region: 'North',
      },
    }),
    db.driver.upsert({
      where: { licenseNumber: 'DL-2201-00002' },
      update: {},
      create: {
        name: 'Priya Sharma',   licenseNumber: 'DL-2201-00002',
        licenseCategory: 'LMV', licenseExpiryDate: new Date('2027-03-15'),
        phone: '+91-9876540002', safetyScore: 88, status: 'AVAILABLE', region: 'South',
      },
    }),
    db.driver.upsert({
      where: { licenseNumber: 'DL-2201-00003' },
      update: {},
      create: {
        name: 'Mohan Das',      licenseNumber: 'DL-2201-00003',
        licenseCategory: 'TRANS', licenseExpiryDate: new Date('2026-12-01'),
        phone: '+91-9876540003', safetyScore: 76, status: 'ON_TRIP', region: 'West',
      },
    }),
    db.driver.upsert({
      where: { licenseNumber: 'DL-2201-00004' },
      update: {},
      create: {
        // SUSPENDED driver — dispatch screen should block this assignment
        name: 'Arjun Nair',     licenseNumber: 'DL-2201-00004',
        licenseCategory: 'HMV', licenseExpiryDate: new Date('2027-09-20'),
        phone: '+91-9876540004', safetyScore: 42, status: 'SUSPENDED', region: 'East',
      },
    }),
    db.driver.upsert({
      where: { licenseNumber: 'DL-2201-00005' },
      update: {},
      create: {
        // Expired license — dispatch screen should block this assignment
        name: 'Sunita Patel',   licenseNumber: 'DL-2201-00005',
        licenseCategory: 'LMV', licenseExpiryDate: new Date('2024-01-01'),
        phone: '+91-9876540005', safetyScore: 81, status: 'AVAILABLE', region: 'North',
      },
    }),
  ]);

  // ─── Trips ──────────────────────────────────────────────────────────────────
  // Trip 1: DISPATCHED (vehicle TRN-003, driver Mohan Das — both ON_TRIP above)
  const dispatchedTrip = await db.trip.upsert({
    where: { id: 'seed-trip-001' },
    update: {},
    create: {
      id: 'seed-trip-001',
      vehicleId: vehicles[2].id, // TRN-003 ON_TRIP
      driverId: drivers[2].id,   // Mohan Das ON_TRIP
      origin: 'Mumbai Warehouse', destination: 'Pune Distribution Centre',
      cargoWeightKg: new Prisma.Decimal(600),
      plannedDistanceKm: new Prisma.Decimal(148),
      revenue: new Prisma.Decimal(18500),
      status: 'DISPATCHED',
      scheduledAt: new Date('2026-07-12T06:00:00Z'),
      dispatchedAt: new Date('2026-07-12T06:15:00Z'),
      startOdometerKm: new Prisma.Decimal(8900),
      notes: 'Priority shipment — refrigerated cargo',
    },
  });

  // Trip 2: COMPLETED — creates fuel log + feeds reports
  const completedTrip = await db.trip.upsert({
    where: { id: 'seed-trip-002' },
    update: {},
    create: {
      id: 'seed-trip-002',
      vehicleId: vehicles[0].id, // TRN-001
      driverId: drivers[0].id,   // Ravi Kumar
      origin: 'Delhi Depot', destination: 'Jaipur Hub',
      cargoWeightKg: new Prisma.Decimal(3200),
      plannedDistanceKm: new Prisma.Decimal(282),
      revenue: new Prisma.Decimal(32000),
      status: 'COMPLETED',
      scheduledAt: new Date('2026-07-10T08:00:00Z'),
      dispatchedAt: new Date('2026-07-10T08:30:00Z'),
      completedAt: new Date('2026-07-10T16:45:00Z'),
      startOdometerKm: new Prisma.Decimal(12100),
      finalOdometerKm: new Prisma.Decimal(12400),
      notes: 'Delivered on time',
    },
  });

  // Fuel log for the completed trip
  await db.fuelLog.upsert({
    where: { id: 'seed-fuel-001' },
    update: {},
    create: {
      id: 'seed-fuel-001',
      vehicleId: vehicles[0].id,
      tripId: completedTrip.id,
      liters: new Prisma.Decimal(38.5),
      pricePerLiter: new Prisma.Decimal(96.5),
      totalCost: new Prisma.Decimal(3715.25),
      odometer: new Prisma.Decimal(12400),
    },
  });

  // ─── Maintenance Log ─────────────────────────────────────────────────────────
  // Vehicle TRN-004 is IN_SHOP — the open log is why
  await db.maintenanceLog.upsert({
    where: { id: 'seed-maint-001' },
    update: {},
    create: {
      id: 'seed-maint-001',
      vehicleId: vehicles[3].id, // TRN-004
      description: 'Scheduled brake pad replacement + engine diagnostic',
      status: 'OPEN',
      cost: new Prisma.Decimal(14500),
    },
  });

  // ─── Expense ─────────────────────────────────────────────────────────────────
  await db.expense.upsert({
    where: { id: 'seed-expense-001' },
    update: {},
    create: {
      id: 'seed-expense-001',
      vehicleId: vehicles[0].id,
      category: 'TOLL',
      amount: new Prisma.Decimal(285),
      description: 'NH-48 toll charges — Delhi to Jaipur',
      occurredAt: new Date('2026-07-10T09:00:00Z'),
    },
  });

  // ─── Print credentials ────────────────────────────────────────────────────────
  console.log('✅  Seed complete!\n');
  console.log('─── Login Credentials ──────────────────────────────');
  for (const u of createdUsers) {
    console.log(`  ${u.role.padEnd(18)}  ${u.email.padEnd(30)}  ${u.password}`);
  }
  console.log('─────────────────────────────────────────────────────\n');
  console.log('Demo scenarios pre-loaded:');
  console.log('  • TRN-003 (VAN) + Mohan Das → ON_TRIP (dispatched trip)');
  console.log('  • TRN-004 (TRUCK) → IN_SHOP with open maintenance log');
  console.log('  • TRN-005 (BUS) → RETIRED (blocked from dispatch)');
  console.log('  • Arjun Nair → SUSPENDED (blocked from dispatch)');
  console.log('  • Sunita Patel → AVAILABLE but license expired 2024-01-01 (blocked)');
  console.log('  • Completed trip TRN-001 Delhi→Jaipur with fuel log for reports\n');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
