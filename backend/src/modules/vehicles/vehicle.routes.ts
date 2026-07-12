import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createVehicleSchema, updateVehicleSchema, vehicleQuerySchema } from './vehicle.schema';
import * as vehicleController from './vehicle.controller';

const router = Router();
router.use(authenticate);

// ── Vehicles (Fleet module) ────────────────────────────────────────────────────
// VIEW  → FLEET_MANAGER, DISPATCHER, FINANCIAL_ANALYST
//         Safety Officer: grid shows "—" = no fleet access
// WRITE → FLEET_MANAGER only

// /available before /:id so Express does not treat "available" as an id param
router.get('/available',
  requireRole(['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST']),
  vehicleController.available
);

router.get('/',
  requireRole(['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST']),
  validateQuery(vehicleQuerySchema),
  vehicleController.list
);
router.get('/:id',
  requireRole(['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST']),
  vehicleController.getOne
);

router.post('/',
  requireRole(['FLEET_MANAGER']),
  validate(createVehicleSchema),
  vehicleController.create
);
router.patch('/:id',
  requireRole(['FLEET_MANAGER']),
  validate(updateVehicleSchema),
  vehicleController.update
);
router.delete('/:id',
  requireRole(['FLEET_MANAGER']),
  vehicleController.remove
);

export default router;
