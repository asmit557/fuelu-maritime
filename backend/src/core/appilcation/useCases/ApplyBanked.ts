import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

/**
 * Use Case: Apply banked surplus to current deficit
 */
export interface ApplyBankedResult {
  shipId: string;
  year: number;
  cbBefore: number;
  bankedApplied: number;
  cbAfter: number;
}

export class ApplyBanked {
  constructor(private bankRepository: IBankRepository) {}

  public async execute(
    cb: ComplianceBalance,
    amountToApply: number
  ): Promise<ApplyBankedResult> {
    const availableBanked = await this.bankRepository.getTotalBanked(cb.shipId);

    if (amountToApply > availableBanked) {
      throw new Error('Insufficient banked surplus');
    }

    if (amountToApply <= 0) {
      throw new Error('Apply amount must be positive');
    }

    // Deduct from oldest bank entries (FIFO)
    await this.bankRepository.deduct(cb.shipId, amountToApply);

    return {
      shipId: cb.shipId,
      year: cb.year,
      cbBefore: cb.cbGco2eq,
      bankedApplied: amountToApply,
      cbAfter: cb.cbGco2eq + amountToApply
    };
  }
}
