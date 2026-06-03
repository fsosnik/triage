const APIServer = require('../src/api/server');
const APIClient = require('../src/api/client');
const { RateLimiter, RequestValidator, ResponseFormatter } = require('../src/api/middleware');

describe('Phase 12: REST API', () => {
  
  test('APIServer should setup routes', () => {
    const mockOS = { orchestrate: () => ({}) };
    const server = new APIServer(mockOS);
    const routes = server.getRoutes();
    expect(routes.length).toBeGreaterThan(0);
  });

  test('APIClient should build requests', async () => {
    const client = new APIClient();
    const req = await client.orchestrate('test task');
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/orchestrate');
  });

  test('RateLimiter should allow requests', () => {
    const limiter = new RateLimiter(10, 1000);
    const result = limiter.check('user1');
    expect(result.allowed).toBe(true);
  });

  test('RequestValidator should validate task', () => {
    const validator = new RequestValidator();
    expect(() => validator.validateTask({ task: 'test' })).not.toThrow();
    expect(() => validator.validateTask({ task: '' })).toThrow();
  });

  test('ResponseFormatter should format success', () => {
    const formatter = new ResponseFormatter();
    const response = formatter.success({ data: 'test' });
    expect(response.status).toBe('success');
  });
});
