import { Request, Response } from 'express';
import { Pool } from 'pg';

export class HealthController {
  constructor(private db: Pool) {}

  check = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check database connection
      await this.db.query('SELECT NOW()');
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
        memory: {
          heapUsed: process.memoryUsage().heapUsed,
          heapTotal: process.memoryUsage().heapTotal,
        },
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: (error as Error).message,
      });
    }
  };
}
