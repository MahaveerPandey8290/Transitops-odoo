import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createDriverSchema, updateDriverSchema, driverQuerySchema } from './driver.schema';
import * as driverController from './driver.controller';

const router = Router();
router.use(authenticate);

// /available before /:id to avoid route shadowing
router.get('/available', driverController.available);

router.get('/', validateQuery(driverQuerySchema), driverController.list);
router.get('/:id', driverController.getOne);

router.post(
  '/',
  requireRole(['FLEET_MANAGER', 'DISPATCHER']),
  validate(createDriverSchema),
  driverController.create
);
router.patch(
  '/:id',
  requireRole(['FLEET_MANAGER', 'DISPATCHER']),
  validate(updateDriverSchema),
  driverController.update
);

export default router;
