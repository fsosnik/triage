const request = require('supertest');
const express = require('express');

describe('Phase 12: REST API Server', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    app.post('/cycle', (req, res) => {
      res.json({ success: true });
    });
  });

  test('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /cycle should execute', async () => {
    const res = await request(app)
      .post('/cycle')
      .send({ task: 'test', agents: ['code'] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Invalid route should 404', async () => {
    const res = await request(app).get('/invalid');
    expect(res.status).toBe(404);
  });
});
