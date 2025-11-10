import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

/**
 * Outbound Port: Compliance Repository Interface
 */
export interface IComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  save(cb: ComplianceBalance): Promise<void>;
}
