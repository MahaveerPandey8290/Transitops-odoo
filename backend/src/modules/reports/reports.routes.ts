import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import * as reportsController from './reports.controller';

const router = Router();
router.use(authenticate);

// ── Dashboard KPI ──────────────────────────────────────────────────────────────
// All four roles need their home page — every authenticated user can see the KPI bar.
// (Dispatcher needs active trip count; Safety Officer needs driver on-duty count, etc.)
router.get('/dashboard/kpis',
  requireRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']),
  reportsController.kpis
);

// ── Analytics / Reports ────────────────────────────────────────────────────────
// VIEW → FLEET_MANAGER, FINANCIAL_ANALYST
//        Dispatcher: grid shows "—"
//        Safety Officer: grid shows "—"
router.get('/reports/fuel-efficiency',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  reportsController.fuelEfficiency
);
router.get('/reports/fleet-utilization',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  reportsController.fleetUtilization
);
router.get('/reports/operational-cost',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  reportsController.operationalCost
);
router.get('/reports/vehicle-roi',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  reportsController.vehicleRoi
);
router.get('/reports/export.csv',
  requireRole(['FLEET_MANAGER', 'FINANCIAL_ANALYST']),
  reportsController.exportCsv
);

export default router;
