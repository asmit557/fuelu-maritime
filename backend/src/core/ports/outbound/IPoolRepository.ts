import { Pool } from '../../domain/entities/Pool';

/**
 * Outbound Port: Pool Repository Interface
 */
export interface IPoolRepository {
  save(pool: Pool): Promise<void>;
  findByYear(year: number): Promise<Pool[]>;
  findById(id: string): Promise<Pool | null>;
}
