import { Pool as PgPool } from 'pg';
import { IPoolRepository } from '../../../core/ports/outbound/IPoolRepository';
import { Pool, PoolMember } from '../../../core/domain/entities/Pool';

/**
 * Outbound Adapter: PostgreSQL Pool Repository
 */
export class PostgresPoolRepository implements IPoolRepository {
  constructor(private db: PgPool) {}

  async save(pool: Pool): Promise<void> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      // Insert pool
      await client.query(
        'INSERT INTO pools (id, year, created_at) VALUES ($1, $2, $3)',
        [pool.id, pool.year, pool.createdAt]
      );

      // Insert pool members
      for (const member of pool.members) {
        await client.query(
          `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
           VALUES ($1, $2, $3, $4)`,
          [pool.id, member.shipId, member.cbBefore, member.cbAfter]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByYear(year: number): Promise<Pool[]> {
    const result = await this.db.query(
      `SELECT p.*, 
              json_agg(json_build_object(
                'shipId', pm.ship_id,
                'cbBefore', pm.cb_before,
                'cbAfter', pm.cb_after
              )) as members
       FROM pools p
       LEFT JOIN pool_members pm ON p.id = pm.pool_id
       WHERE p.year = $1
       GROUP BY p.id`,
      [year]
    );

    return result.rows.map(row => new Pool(
      row.id,
      row.year,
      row.members,
      new Date(row.created_at)
    ));
  }

  async findById(id: string): Promise<Pool | null> {
    const result = await this.db.query(
      `SELECT p.*, 
              json_agg(json_build_object(
                'shipId', pm.ship_id,
                'cbBefore', pm.cb_before,
                'cbAfter', pm.cb_after
              )) as members
       FROM pools p
       LEFT JOIN pool_members pm ON p.id = pm.pool_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    return result.rows.length > 0 
      ? new Pool(result.rows[0].id, result.rows[0].year, result.rows[0].members, new Date(result.rows[0].created_at))
      : null;
  }
}
