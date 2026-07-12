import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createDriverSchema, updateDriverSchema, driverQuerySchema } from './driver.schema';
import * as driverController from './driver.controller';

const router = Router();
router.use(authenticate);

// ── Drivers module ─────────────────────────────────────────────────────────────
// VIEW  → FLEET_MANAGER, SAFETY_OFFICER
//         Dispatcher: grid shows "—" = was incorrectly allowed, now removed
//         Financial Analyst: grid shows "—" = no access
// WRITE → FLEET_MANAGER, SAFETY_OFFICER

// /available before /:id to avoid route shadowing
router.get('/available',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  driverController.available
);

router.get('/',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validateQuery(driverQuerySchema),
  driverController.list
);
router.get('/:id',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  driverController.getOne
);

router.post('/',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validate(createDriverSchema),
  driverController.create
);
router.patch('/:id',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validate(updateDriverSchema),
  driverController.update
);

export default router;
