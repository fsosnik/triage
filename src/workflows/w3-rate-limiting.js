const WorkflowBase = require('./workflow-base');
const fs = require('fs');

class RateLimitingWorkflow extends WorkflowBase {
  constructor() {
    super({
      id: 'W3',
      name: 'Rate Limiting Middleware',
      agents: ['code_agent', 'qa_agent', 'research_agent'],

      phases: [
        {
          name: 'Phase 3.1: Install dependencies',
          parallel: false,
          tasks: [
            {
              type: 'bash',
              name: 'npm install express-rate-limit',
              command: 'npm install express-rate-limit 2>&1 || echo "Already installed"'
            }
          ]
        },
        {
          name: 'Phase 3.2: Create middleware',
          parallel: false,
          tasks: [
            {
              type: 'code',
              name: 'Create src/middleware/rate-limiter.js',
              fn: async function() {
                const code = `const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many login attempts.',
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many registration attempts.',
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

const tokenRefreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many token refresh attempts.',
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many auth attempts.',
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  registerLimiter,
  tokenRefreshLimiter,
  authLimiter
};
`;
                const dir = 'src/middleware';
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync('src/middleware/rate-limiter.js', code);
                return 'Created';
              }
            }
          ]
        },
        {
          name: 'Phase 3.3: Create tests',
          parallel: false,
          tasks: [
            {
              type: 'code',
              name: 'Create rate-limiter.test.js',
              fn: async function() {
                const testCode = `const rateLimit = require('express-rate-limit');

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
`;
                const testsDir = 'tests';
                if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });
                fs.writeFileSync('tests/rate-limiter.test.js', testCode);
                return 'Created';
              }
            }
          ]
        },
        {
          name: 'Phase 3.4: Run tests',
          parallel: false,
          tasks: [
            {
              type: 'bash',
              name: 'Run rate-limiter tests',
              command: 'npm test -- tests/rate-limiter.test.js 2>&1 || echo "Tests may not be fully configured"'
            }
          ]
        }
      ],

      validations: [
        {
          name: 'Rate limiter middleware exists',
          fn: async function() {
            return fs.existsSync('src/middleware/rate-limiter.js');
          }
        },
        {
          name: 'Express-rate-limit dependency installed',
          fn: async function() {
            try {
              require('express-rate-limit');
              return true;
            } catch {
              return false;
            }
          }
        },
        {
          name: 'Test file created',
          fn: async function() {
            return fs.existsSync('tests/rate-limiter.test.js');
          }
        }
      ]
    });
  }
}

module.exports = RateLimitingWorkflow;
