import { IComplianceService } from '../../core/ports/inbound/IComplianceService';
import { IComplianceRepository } from '../../core/ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../core/ports/outbound/IBankRepository';
import { ComplianceBalance } from '../../core/domain/entities/ComplianceBalance';

/**
 * Compliance Service Implementation
 */
export class ComplianceService implements IComplianceService {
  constructor(
    private complianceRepository: IComplianceRepository,
    private bankRepository: IBankRepository
  ) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!cb) {
      throw new Error('Compliance balance not found');
    }
    return cb;
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<number> {
    const cb = await this.getComplianceBalance(shipId, year);
    const banked = await this.bankRepository.getTotalBanked(shipId);
    return cb.cbGco2eq + banked;
  }
}
