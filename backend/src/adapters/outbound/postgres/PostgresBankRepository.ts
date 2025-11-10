import { Pool } from 'pg';
import { IBankRepository } from '../../../core/ports/outbound/IBankRepository';
import { BankEntry } from '../../../core/domain/entities/BankEntry';

/**
 * Outbound Adapter: PostgreSQL Bank Repository
 */
export class PostgresBankRepository implements IBankRepository {
  constructor(private db: Pool) {}

  async save(entry: BankEntry): Promise<void> {
    await this.db.query(
      `INSERT INTO bank_entries (id, ship_id, year, amount_gco2eq, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [entry.id, entry.shipId, entry.year, entry.amountGco2eq, entry.createdAt]
    );
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await this.db.query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at',
      [shipId, year]
    );
    return result.rows.map(row => new BankEntry(
      row.id,
      row.ship_id,
      row.year,
      parseFloat(row.amount_gco2eq),
      new Date(row.created_at)
    ));
  }

  async getTotalBanked(shipId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1',
      [shipId]
    );
    return parseFloat(result.rows[0].total);
  }

  async deduct(shipId: string, amount: number): Promise<void> {
    // FIFO deduction: Remove from oldest entries first
    const entries = await this.db.query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 ORDER BY created_at FOR UPDATE',
      [shipId]
    );

    let remaining = amount;
    for (const entry of entries.rows) {
      if (remaining <= 0) break;

      const entryAmount = parseFloat(entry.amount_gco2eq);
      if (entryAmount <= remaining) {
        // Delete entire entry
        await this.db.query('DELETE FROM bank_entries WHERE id = $1', [entry.id]);
        remaining -= entryAmount;
      } else {
        // Partial deduction
        await this.db.query(
          'UPDATE bank_entries SET amount_gco2eq = $1 WHERE id = $2',
          [entryAmount - remaining, entry.id]
        );
        remaining = 0;
      }
    }
  }
}
