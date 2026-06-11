const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Please try again later.',
  statusCode: 429,
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const internalIPs = (process.env.INTERNAL_IPS || '').split(',').filter(Boolean);
    return internalIPs.includes(req.ip);
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please try again later.',
  statusCode: 429,
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

const tokenRefreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many token refresh attempts. Please try again later.',
  statusCode: 429,
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many auth attempts. Please try again later.',
  statusCode: 429,
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
