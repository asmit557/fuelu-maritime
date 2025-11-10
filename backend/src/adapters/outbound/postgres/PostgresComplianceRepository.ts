import { Pool } from 'pg';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';
import { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';

/**
 * Outbound Adapter: PostgreSQL Compliance Repository
 */
export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private db: Pool) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await this.db.query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return new ComplianceBalance(
      row.id,
      row.ship_id,
      row.year,
      parseFloat(row.cb_gco2eq),
      parseFloat(row.target_intensity),
      parseFloat(row.actual_intensity),
      parseFloat(row.energy)
    );
  }

  async save(cb: ComplianceBalance): Promise<void> {
    await this.db.query(
      `INSERT INTO ship_compliance (id, ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (ship_id, year) DO UPDATE SET
       cb_gco2eq = EXCLUDED.cb_gco2eq,
       target_intensity = EXCLUDED.target_intensity,
       actual_intensity = EXCLUDED.actual_intensity,
       energy = EXCLUDED.energy`,
      [cb.id, cb.shipId, cb.year, cb.cbGco2eq, cb.targetIntensity, cb.actualIntensity, cb.energy]
    );
  }
}
