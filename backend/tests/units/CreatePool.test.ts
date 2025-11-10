import { CreatePool } from '../../src/core/application/useCases/CreatePool';
import { IPoolRepository } from '../../src/core/ports/outbound/IPoolRepository';

describe('CreatePool Use Case', () => {
  let mockPoolRepo: jest.Mocked<IPoolRepository>;
  let createPool: CreatePool;

  beforeEach(() => {
    mockPoolRepo = {
      save: jest.fn(),
      findByYear: jest.fn(),
      findById: jest.fn(),
    };
    createPool = new CreatePool(mockPoolRepo);
  });

  test('should create valid pool', async () => {
    const input = {
      year: 2025,
      members: [
        { shipId: 'SHIP001', cbBefore: 100000, cbAfter: 50000 },
        { shipId: 'SHIP002', cbBefore: -50000, cbAfter: 0 },
      ],
    };

    const pool = await createPool.execute(input);

    expect(pool.year).toBe(2025);
    expect(pool.members).toHaveLength(2);
    expect(mockPoolRepo.save).toHaveBeenCalledWith(pool);
  });

  test('should reject pool with less than 2 members', async () => {
    const input = {
      year: 2025,
      members: [{ shipId: 'SHIP001', cbBefore: 100000, cbAfter: 100000 }],
    };

    await expect(createPool.execute(input)).rejects.toThrow('Pool must have at least 2 members');
  });
});
