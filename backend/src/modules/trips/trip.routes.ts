import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createTripSchema, completeTripSchema, tripQuerySchema } from './trip.schema';
import * as tripController from './trip.controller';

const router = Router();
router.use(authenticate);

router.get('/', validateQuery(tripQuerySchema), tripController.list);
router.get('/:id', tripController.getOne);

router.post(
  '/',
  requireRole(['DISPATCHER', 'FLEET_MANAGER']),
  validate(createTripSchema),
  tripController.create
);
router.post('/:id/dispatch', requireRole(['DISPATCHER', 'FLEET_MANAGER']), tripController.dispatch);
router.post(
  '/:id/complete',
  requireRole(['DISPATCHER', 'FLEET_MANAGER']),
  validate(completeTripSchema),
  tripController.complete
);
router.post('/:id/cancel', requireRole(['DISPATCHER', 'FLEET_MANAGER']), tripController.cancel);

export default router;
