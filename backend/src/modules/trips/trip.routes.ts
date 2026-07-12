import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { createTripSchema, completeTripSchema, tripQuerySchema } from './trip.schema';
import * as tripController from './trip.controller';

const router = Router();
router.use(authenticate);

// ── Trips module ───────────────────────────────────────────────────────────────
// VIEW  → DISPATCHER, SAFETY_OFFICER
//         Fleet Manager: grid shows "—" for Trips column
//         Financial Analyst: grid shows "—" = no access
// WRITE → DISPATCHER only (create, dispatch, complete, cancel)
//         Fleet Manager: grid shows "—" = removed from write array

router.get('/',
  requireRole(['DISPATCHER', 'SAFETY_OFFICER']),
  validateQuery(tripQuerySchema),
  tripController.list
);
router.get('/:id',
  requireRole(['DISPATCHER', 'SAFETY_OFFICER']),
  tripController.getOne
);

router.post('/',
  requireRole(['DISPATCHER']),
  validate(createTripSchema),
  tripController.create
);
router.post('/:id/dispatch',
  requireRole(['DISPATCHER']),
  tripController.dispatch
);
router.post('/:id/complete',
  requireRole(['DISPATCHER']),
  validate(completeTripSchema),
  tripController.complete
);
router.post('/:id/cancel',
  requireRole(['DISPATCHER']),
  tripController.cancel
);

export default router;
