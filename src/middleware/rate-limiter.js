const rateLimit = require('express-rate-limit');

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
