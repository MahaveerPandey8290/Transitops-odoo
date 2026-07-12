import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import {
  createFuelLogSchema,
  fuelLogQuerySchema,
  createExpenseSchema,
  expenseQuerySchema,
} from './fuelExpense.schema';
import * as fuelExpenseController from './fuelExpense.controller';

const router = Router();
router.use(authenticate);

// ── Fuel & Expenses module ─────────────────────────────────────────────────────
// VIEW  → FLEET_MANAGER, FINANCIAL_ANALYST
//         Dispatcher: removed (grid shows "—")
// WRITE → FINANCIAL_ANALYST only
//         Fleet Manager: grid shows "—" for Fuel/Exp column
//         Dispatcher: removed (grid shows "—")

router.get('/fuel-logs',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  validateQuery(fuelLogQuerySchema),
  fuelExpenseController.listFuelLogs
);
router.post('/fuel-logs',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  validate(createFuelLogSchema),
  fuelExpenseController.createFuelLog
);

router.get('/expenses',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  validateQuery(expenseQuerySchema),
  fuelExpenseController.listExpenses
);
router.post('/expenses',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  validate(createExpenseSchema),
  fuelExpenseController.createExpense
);

export default router;
