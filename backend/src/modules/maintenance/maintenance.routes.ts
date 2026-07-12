import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createMaintenanceSchema, maintenanceQuerySchema } from './maintenance.schema';
import * as maintenanceController from './maintenance.controller';

const router = Router();
router.use(authenticate);

// ── Maintenance / Compliance module ───────────────────────────────────────────
// VIEW  → FLEET_MANAGER, SAFETY_OFFICER
//         Dispatcher: no Maintenance screen (only Dashboard, Fleet-view, Trips)
//         Financial Analyst: no Maintenance screen (only Dashboard, Fleet-view, Fuel, Analytics)
// WRITE → FLEET_MANAGER, SAFETY_OFFICER

router.get('/',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validateQuery(maintenanceQuerySchema),
  maintenanceController.list
);
router.post('/',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validate(createMaintenanceSchema),
  maintenanceController.create
);
router.patch('/:id/close',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  maintenanceController.close
);

export default router;
