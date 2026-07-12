import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createMaintenanceSchema, maintenanceQuerySchema } from './maintenance.schema';
import * as maintenanceController from './maintenance.controller';

const router = Router();
router.use(authenticate);

// ── Maintenance / Compliance module ───────────────────────────────────────────
// VIEW  → all four roles (every role can see the compliance log)
// WRITE → FLEET_MANAGER, SAFETY_OFFICER (unchanged — was already correct)

router.get('/',
  requireRole(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']),
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
