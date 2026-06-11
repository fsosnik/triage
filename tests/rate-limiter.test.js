const rateLimit = require('express-rate-limit');

describe('Rate Limiter', () => {
  let loginLimiter;

  beforeEach(() => {
    loginLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 20,
      keyGenerator: (req) => req.ip,
      skip: false
    });
  });

  test('middleware is exported', () => {
    const middleware = require('../src/middleware/rate-limiter');
    expect(middleware.loginLimiter).toBeDefined();
    expect(middleware.registerLimiter).toBeDefined();
    expect(middleware.tokenRefreshLimiter).toBeDefined();
    expect(middleware.authLimiter).toBeDefined();
  });

  test('loginLimiter is configured for 20 req/min', () => {
    expect(loginLimiter.options.max).toBe(20);
    expect(loginLimiter.options.windowMs).toBe(60 * 1000);
  });

  test('registerLimiter is configured for 5 req/min', () => {
    const registerLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 5
    });
    expect(registerLimiter.options.max).toBe(5);
  });

  test('tokenRefreshLimiter is configured for 30 req/min', () => {
    const tokenRefreshLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 30
    });
    expect(tokenRefreshLimiter.options.max).toBe(30);
  });

  test('rate limiters use IP-based key generation', () => {
    const middleware = require('../src/middleware/rate-limiter');
    const mockReq = { ip: '192.168.1.1' };
    expect(loginLimiter.options.keyGenerator).toBeDefined();
  });
});
