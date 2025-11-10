import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg';
import { createRoutes } from './routes';

export const createApp = (dbPool: Pool): Express => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true, // Important for cookies
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api', createRoutes(dbPool));

  // Error handling
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};
