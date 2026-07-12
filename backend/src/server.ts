import app from './app';
import { env } from './config/env';
import db from './config/db';

async function start() {
  try {
    await db.$connect();
    console.log('✅  Database connected');

    app.listen(env.PORT, () => {
      console.log(`🚀  TransitOps API running on http://localhost:${env.PORT}`);
      console.log(`📋  Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
}

start();
