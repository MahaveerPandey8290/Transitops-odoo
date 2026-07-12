import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Single instance for the lifetime of the process.
// Never import PrismaClient elsewhere — always use this export.
const db = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

export default db;
