import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import driverRoutes from './modules/drivers/driver.routes';
import tripRoutes from './modules/trips/trip.routes';
import maintenanceRoutes from './modules/maintenance/maintenance.routes';
import fuelExpenseRoutes from './modules/fuel-expense/fuelExpense.routes';
import reportsRoutes from './modules/reports/reports.routes';
import userRoutes from './modules/users/user.routes';

const app = express();

// ─── Security & Logging ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(morgan('dev'));

// Global rate limiter — more permissive than the auth-specific one
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests', code: 'RATE_LIMITED' },
});
app.use(globalLimiter);

app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'TransitOps API is running', timestamp: new Date().toISOString() });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api', fuelExpenseRoutes); // mounts /api/fuel-logs and /api/expenses
app.use('/api', reportsRoutes);     // mounts /api/dashboard/kpis and /api/reports/*
app.use('/api/users', userRoutes);

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 'NOT_FOUND' });
});

app.use(errorMiddleware);

export default app;
