import { BankEntry } from '../../domain/entities/BankEntry';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use Case: Bank surplus CB for future use
 */
export class BankSurplus {
  constructor(private bankRepository: IBankRepository) {}

  public async execute(
    cb: ComplianceBalance,
    amountToBank: number
  ): Promise<BankEntry> {
    if (!cb.isSurplus()) {
      throw new Error('Cannot bank deficit CB');
    }

    if (amountToBank > cb.cbGco2eq) {
      throw new Error('Cannot bank more than available surplus');
    }

    if (amountToBank <= 0) {
      throw new Error('Bank amount must be positive');
    }

    const entry = new BankEntry(
      uuidv4(),
      cb.shipId,
      cb.year,
      amountToBank
    );

    await this.bankRepository.save(entry);
    return entry;
  }
}
