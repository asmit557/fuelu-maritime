import { Router } from 'express';
import { Pool } from 'pg';
import cookieParser from 'cookie-parser';

// Import controllers
import { RouteController } from '../../adapters/inbound/http/RouteController';
import { ComplianceController } from '../../adapters/inbound/http/ComplianceController';
import { BankingController } from '../../adapters/inbound/http/BankingController';
import { PoolController } from '../../adapters/inbound/http/PoolController';
import { AuthController } from '../../adapters/inbound/http/AuthController';

// Import services and repositories
import { RouteService } from '../../adapters/services/RouteService';
import { ComplianceService } from '../../adapters/services/ComplianceService';
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresBankRepository } from '../../adapters/outbound/postgres/PostgresBankRepository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/PostgresPoolRepository';
import { PostgresUserRepository } from '../../adapters/outbound/postgres/PostgresUserRepository';

// Import middleware
import { authMiddleware, requireRole } from './middleware/authMiddleware';

export const createRoutes = (dbPool: Pool): Router => {
  const router = Router();

  // Initialize repositories
  const routeRepository = new PostgresRouteRepository(dbPool);
  const complianceRepository = new PostgresComplianceRepository(dbPool);
  const bankRepository = new PostgresBankRepository(dbPool);
  const poolRepository = new PostgresPoolRepository(dbPool);
  const userRepository = new PostgresUserRepository(dbPool);

  // Initialize services
  const routeService = new RouteService(routeRepository);
  const complianceService = new ComplianceService(complianceRepository, bankRepository);

  // Initialize controllers
  const routeController = new RouteController(routeService);
  const complianceController = new ComplianceController(complianceService);
  const bankingController = new BankingController(bankRepository, complianceRepository);
  const poolController = new PoolController(poolRepository);
  const authController = new AuthController(userRepository);

  // ===== PUBLIC AUTH ROUTES (No authentication required) =====
  router.post('/auth/login', authController.login);
  router.post('/auth/guest', authController.guestLogin);
  router.post('/auth/register', authController.register);
  router.post('/auth/logout', authController.logout);
  router.get('/auth/verify', authController.verify);

  // ===== PROTECTED ROUTES (Authentication required) =====
  // Apply auth middleware to all routes below
  router.use(authMiddleware);

  // Route endpoints
  router.get('/routes', routeController.getAllRoutes);
  router.post('/routes/:id/baseline', requireRole('admin', 'user'), routeController.setBaseline);
  router.get('/routes/comparison', routeController.getComparison);

  // Compliance endpoints
  router.get('/compliance/cb', complianceController.getComplianceBalance);
  router.get('/compliance/adjusted-cb', complianceController.getAdjustedCB);

  // Banking endpoints
  router.get('/banking/records', bankingController.getBankRecords);
  router.post('/banking/bank', requireRole('admin', 'user'), bankingController.bankSurplus);
  router.post('/banking/apply', requireRole('admin', 'user'), bankingController.applyBanked);

  // Pool endpoints (admin only for creating pools)
  router.post('/pools', requireRole('admin'), poolController.createPool);

  return router;
};
