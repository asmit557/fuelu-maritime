import { Route, ComparisonData } from '../domain/models/Route';
import { ComplianceBalance, BankEntry, Pool, PoolMember } from '../domain/models/Compliance';

/**
 * API Client Port - defines contract for backend communication
 */
export interface IApiClient {
  // Routes
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonData[]>;
  
  // Compliance
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number }>;
  
  // Banking
  getBankRecords(shipId: string, year?: number): Promise<{ records: BankEntry[]; total: number }>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<void>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
  
  // Pooling
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
}
