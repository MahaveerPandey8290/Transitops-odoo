import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createMaintenanceSchema, maintenanceQuerySchema } from './maintenance.schema';
import * as maintenanceController from './maintenance.controller';

const router = Router();
router.use(authenticate);

router.get('/', validateQuery(maintenanceQuerySchema), maintenanceController.list);
router.post(
  '/',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  validate(createMaintenanceSchema),
  maintenanceController.create
);
router.patch(
  '/:id/close',
  requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']),
  maintenanceController.close
);

export default router;
