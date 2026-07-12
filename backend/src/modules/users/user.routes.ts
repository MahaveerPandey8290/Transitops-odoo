import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { validate, validateQuery } from '../../middlewares/validate.middleware';
import { updateRoleSchema, userQuerySchema } from './user.schema';
import * as userController from './user.controller';

const router = Router();
router.use(authenticate);
router.use(requireRole(['FLEET_MANAGER'])); // entire users resource is Fleet Manager only

router.get('/', validateQuery(userQuerySchema), userController.list);
router.patch('/:id/role', validate(updateRoleSchema), userController.updateRole);

export default router;
