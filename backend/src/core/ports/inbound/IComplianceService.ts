import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

/**
 * Inbound Port: Compliance Service Interface
 */
export interface IComplianceService {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<number>;
}
