import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createVehicleSchema, updateVehicleSchema, vehicleQuerySchema } from './vehicle.schema';
import * as vehicleController from './vehicle.controller';

const router = Router();
router.use(authenticate);

// /available must be declared before /:id so Express doesn't treat "available" as an id
router.get('/available', vehicleController.available);

router.get('/', validateQuery(vehicleQuerySchema), vehicleController.list);
router.get('/:id', vehicleController.getOne);

router.post(
  '/',
  requireRole(['FLEET_MANAGER']),
  validate(createVehicleSchema),
  vehicleController.create
);
router.patch(
  '/:id',
  requireRole(['FLEET_MANAGER']),
  validate(updateVehicleSchema),
  vehicleController.update
);

export default router;
