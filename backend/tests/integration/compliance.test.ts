import request from 'supertest';
import { createApp } from '../../src/infrastructure/server/app';
import { createDbPool } from '../../src/infrastructure/db/connection';

describe('Compliance API', () => {
  const dbPool = createDbPool();
  const app = createApp(dbPool);

  afterAll(async () => {
    await dbPool.end();
  });

  test('GET /api/compliance/cb should return compliance balance', async () => {
    const response = await request(app)
      .get('/api/compliance/cb')
      .query({ shipId: 'SHIP001', year: 2025 })
      .expect(200);

    expect(response.body).toHaveProperty('cbGco2eq');
    expect(response.body).toHaveProperty('targetIntensity');
    expect(response.body.year).toBe(2025);
  });

  test('GET /api/compliance/adjusted-cb should return adjusted CB', async () => {
    const response = await request(app)
      .get('/api/compliance/adjusted-cb')
      .query({ shipId: 'SHIP001', year: 2025 })
      .expect(200);

    expect(response.body).toHaveProperty('adjustedCb');
  });
});
