import request from 'supertest';
import { createApp } from '../../src/infrastructure/server/app';
import { createDbPool } from '../../src/infrastructure/db/connection';

describe('Banking API', () => {
  const dbPool = createDbPool();
  const app = createApp(dbPool);

  afterAll(async () => {
    await dbPool.end();
  });

  test('POST /api/banking/bank should bank surplus', async () => {
    const response = await request(app)
      .post('/api/banking/bank')
      .send({
        shipId: 'SHIP001',
        year: 2025,
        amount: 100000000
      })
      .expect(200);

    expect(response.body.message).toContain('banked successfully');
  });

  test('POST /api/banking/apply should apply banked surplus', async () => {
    // First bank some surplus
    await request(app)
      .post('/api/banking/bank')
      .send({ shipId: 'SHIP001', year: 2025, amount: 100000000 });

    // Then apply it
    const response = await request(app)
      .post('/api/banking/apply')
      .send({ shipId: 'SHIP001', year: 2025, amount: 50000000 })
      .expect(200);

    expect(response.body.message).toContain('applied successfully');
  });

  test('GET /api/banking/records should return bank records', async () => {
    const response = await request(app)
      .get('/api/banking/records')
      .query({ shipId: 'SHIP001' })
      .expect(200);

    expect(response.body).toHaveProperty('records');
    expect(response.body).toHaveProperty('total');
  });
});
