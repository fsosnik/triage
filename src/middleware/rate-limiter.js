const rateLimit = require('express-rate-limit');

// Usar el helper IPv6-safe incorporado en express-rate-limit
const { ipKeyGenerator } = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: ipKeyGenerator,
  message: 'Too many login attempts.',
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: ipKeyGenerator,
  message: 'Too many registration attempts.',
  standardHeaders: true,
  legacyHeaders: false
});

const tokenRefreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: ipKeyGenerator,
  message: 'Too many token refresh attempts.',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: ipKeyGenerator,
  message: 'Too many auth attempts.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  registerLimiter,
  tokenRefreshLimiter,
  authLimiter
};
