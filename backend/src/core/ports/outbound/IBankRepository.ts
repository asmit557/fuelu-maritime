import { BankEntry } from '../../domain/entities/BankEntry';

/**
 * Outbound Port: Bank Repository Interface
 */
export interface IBankRepository {
  save(entry: BankEntry): Promise<void>;
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string): Promise<number>;
  deduct(shipId: string, amount: number): Promise<void>;
}
