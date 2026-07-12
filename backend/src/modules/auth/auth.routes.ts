import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import * as authController from './auth.controller';

const router = Router();

// Brute-force protection on login only — tighter window than global rate limiter
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', loginRateLimit, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
