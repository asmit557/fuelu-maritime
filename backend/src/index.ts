import dotenv from 'dotenv';
import { createDbPool } from './infrastructure/db/connection';
import { createApp } from './infrastructure/server/app';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database connection
    const dbPool = createDbPool();
    
    // Test database connection
    await dbPool.query('SELECT NOW()');
    console.log('✓ Database connected successfully');

    // Create and start Express app
    const app = createApp(dbPool);
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
