import { Pool, PoolMember } from '../../domain/entities/Pool';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';
import { v4 as uuidv4 } from 'uuid';

/**
 * Use Case: Create a pooling arrangement
 */
export interface CreatePoolInput {
  year: number;
  members: PoolMember[];
}

export class CreatePool {
  constructor(private poolRepository: IPoolRepository) {}

  public async execute(input: CreatePoolInput): Promise<Pool> {
    // Domain validation happens in Pool constructor
    const pool = new Pool(
      uuidv4(),
      input.year,
      input.members
    );

    await this.poolRepository.save(pool);
    return pool;
  }
}
