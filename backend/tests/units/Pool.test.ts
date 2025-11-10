import { Pool } from '../../src/core/domain/entities/Pool';

describe('Pool Entity', () => {
  test('should create valid pool', () => {
    const pool = new Pool('pool-1', 2025, [
      { shipId: 'SHIP001', cbBefore: 100000, cbAfter: 50000 },
      { shipId: 'SHIP002', cbBefore: -50000, cbAfter: 0 }
    ]);

    expect(pool.getTotalCbBefore()).toBe(50000);
    expect(pool.getTotalCbAfter()).toBe(50000);
  });

  test('should reject pool with unbalanced CB', () => {
    expect(() => {
      new Pool('pool-1', 2025, [
        { shipId: 'SHIP001', cbBefore: 100000, cbAfter: 60000 },
        { shipId: 'SHIP002', cbBefore: -50000, cbAfter: 0 }
      ]);
    }).toThrow('Pool must conserve total compliance balance');
  });

  test('should reject pool where deficit ship exits worse', () => {
    expect(() => {
      new Pool('pool-1', 2025, [
        { shipId: 'SHIP001', cbBefore: 100000, cbAfter: 40000 },
        { shipId: 'SHIP002', cbBefore: -50000, cbAfter: -60000 }
      ]);
    }).toThrow('Deficit ship');
  });

  test('should reject pool where surplus ship exits negative', () => {
    expect(() => {
      new Pool('pool-1', 2025, [
        { shipId: 'SHIP001', cbBefore: 50000, cbAfter: -10000 },
        { shipId: 'SHIP002', cbBefore: -50000, cbAfter: -40000 }
      ]);
    }).toThrow('Surplus ship');
  });
});
