import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import * as reportsController from './reports.controller';

const router = Router();
router.use(authenticate);

// Dashboard
router.get('/dashboard/kpis', reportsController.kpis);

// Reports — all roles can read reports; FINANCIAL_ANALYST is the primary consumer
router.get('/reports/fuel-efficiency', reportsController.fuelEfficiency);
router.get('/reports/fleet-utilization', reportsController.fleetUtilization);
router.get('/reports/operational-cost', reportsController.operationalCost);
router.get('/reports/vehicle-roi', reportsController.vehicleRoi);
router.get('/reports/export.csv', reportsController.exportCsv);

export default router;
