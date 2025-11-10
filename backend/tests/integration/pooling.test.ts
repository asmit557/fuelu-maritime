import request from 'supertest';
import { createApp } from '../../src/infrastructure/server/app';
import { createDbPool } from '../../src/infrastructure/db/connection';

describe('Pooling API', () => {
  const dbPool = createDbPool();
  const app = createApp(dbPool);

  afterAll(async () => {
    await dbPool.end();
  });

  test('POST /api/pools should create valid pool', async () => {
    const response = await request(app)
      .post('/api/pools')
      .send({
        year: 2025,
        members: [
          { shipId: 'SHIP001', cbBefore: 432500000, cbAfter: 309500000 },
          { shipId: 'SHIP005', cbBefore: -123000000, cbAfter: 0 }
        ]
      })
      .expect(200);

    expect(response.body.message).toContain('created successfully');
    expect(response.body.pool).toHaveProperty('id');
  });

  test('POST /api/pools should reject invalid pool', async () => {
    const response = await request(app)
      .post('/api/pools')
      .send({
        year: 2025,
        members: [
          { shipId: 'SHIP001', cbBefore: 100000, cbAfter: 60000 },
          { shipId: 'SHIP002', cbBefore: -50000, cbAfter: 0 }
        ]
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});
