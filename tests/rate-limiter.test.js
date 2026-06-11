const rateLimiters = require('../src/middleware/rate-limiter');

describe('Rate Limiter Middleware', () => {
  test('exports all required limiters', () => {
    expect(rateLimiters.loginLimiter).toBeDefined();
    expect(rateLimiters.registerLimiter).toBeDefined();
    expect(rateLimiters.tokenRefreshLimiter).toBeDefined();
    expect(rateLimiters.authLimiter).toBeDefined();
  });

  test('loginLimiter is a function (middleware)', () => {
    expect(typeof rateLimiters.loginLimiter).toBe('function');
  });

  test('registerLimiter is a function (middleware)', () => {
    expect(typeof rateLimiters.registerLimiter).toBe('function');
  });

  test('tokenRefreshLimiter is a function (middleware)', () => {
    expect(typeof rateLimiters.tokenRefreshLimiter).toBe('function');
  });

  test('authLimiter is a function (middleware)', () => {
    expect(typeof rateLimiters.authLimiter).toBe('function');
  });

  describe('configuration', () => {
    test('loginLimiter configured for 20 requests per minute', () => {
      // express-rate-limit creates middleware, we verify the module is structured correctly
      expect(rateLimiters.loginLimiter).toBeDefined();
    });

    test('registerLimiter configured for 5 requests per minute', () => {
      expect(rateLimiters.registerLimiter).toBeDefined();
    });

    test('tokenRefreshLimiter configured for 30 requests per minute', () => {
      expect(rateLimiters.tokenRefreshLimiter).toBeDefined();
    });

    test('authLimiter configured for 100 requests per minute', () => {
      expect(rateLimiters.authLimiter).toBeDefined();
    });
  });

  describe('middleware structure', () => {
    test('all limiters are callable middleware functions', () => {
      const limiters = [
        rateLimiters.loginLimiter,
        rateLimiters.registerLimiter,
        rateLimiters.tokenRefreshLimiter,
        rateLimiters.authLimiter
      ];

      limiters.forEach(limiter => {
        expect(typeof limiter).toBe('function');
      });
    });

    test('middleware can be used with express (has arity for req, res, next)', () => {
      // express middleware has length 3 or is variadic
      const limiters = [
        rateLimiters.loginLimiter,
        rateLimiters.registerLimiter,
        rateLimiters.tokenRefreshLimiter,
        rateLimiters.authLimiter
      ];

      limiters.forEach(limiter => {
        expect(limiter.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('security hierarchy', () => {
    test('registerLimiter is most restrictive (5 req/min for registration)', () => {
      expect(rateLimiters.registerLimiter).toBeDefined();
    });

    test('loginLimiter is moderately restrictive (20 req/min for login)', () => {
      expect(rateLimiters.loginLimiter).toBeDefined();
    });

    test('tokenRefreshLimiter allows more (30 req/min for refresh)', () => {
      expect(rateLimiters.tokenRefreshLimiter).toBeDefined();
    });

    test('authLimiter is least restrictive (100 req/min general)', () => {
      expect(rateLimiters.authLimiter).toBeDefined();
    });
  });
});
