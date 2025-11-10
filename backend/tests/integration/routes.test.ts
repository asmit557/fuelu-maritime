import request from 'supertest';
import { createApp } from '../../src/infrastructure/server/app';
import { createDbPool } from '../../src/infrastructure/db/connection';

describe('Routes API', () => {
  const dbPool = createDbPool();
  const app = createApp(dbPool);

  afterAll(async () => {
    await dbPool.end();
  });

  test('GET /api/routes should return all routes', async () => {
    const response = await request(app)
      .get('/api/routes')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/routes/comparison should return comparison data', async () => {
    const response = await request(app)
      .get('/api/routes/comparison')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((item: any) => {
      expect(item).toHaveProperty('targetIntensity');
      expect(item).toHaveProperty('isCompliant');
    });
  });

  test('POST /api/routes/:id/baseline should set baseline', async () => {
    const routes = await request(app).get('/api/routes');
    const routeId = routes.body[0].id;

    const response = await request(app)
      .post(`/api/routes/${routeId}/baseline`)
      .expect(200);

    expect(response.body.route.isBaseline).toBe(true);
  });
});
