/**
 * Phase 12: API Middleware
 */

class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  check(clientId) {
    const now = Date.now();
    if (!this.requests.has(clientId)) this.requests.set(clientId, []);
    
    const reqs = this.requests.get(clientId);
    const valid = reqs.filter(t => now - t < this.windowMs);
    
    if (valid.length >= this.maxRequests) return { allowed: false };
    valid.push(now);
    this.requests.set(clientId, valid);
    return { allowed: true, remaining: this.maxRequests - valid.length };
  }
}

class RequestValidator {
  validateTask(body) {
    if (!body.task || typeof body.task !== 'string') throw new Error('Invalid task');
    return true;
  }
}

class ResponseFormatter {
  success(data) {
    return { status: 'success', data, timestamp: new Date().toISOString() };
  }

  error(message, code) {
    return { status: 'error', error: message, code, timestamp: new Date().toISOString() };
  }
}

module.exports = { RateLimiter, RequestValidator, ResponseFormatter };
