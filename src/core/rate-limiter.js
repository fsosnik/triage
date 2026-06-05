class RateLimiter {
  constructor(maxPerSecond = 10) {
    this.maxPerSecond = maxPerSecond;
    this.queue = [];
    this.count = 0;
  }
  
  async execute(fn) {
    this.count++;
    if (this.count > this.maxPerSecond) {
      await new Promise(r => setTimeout(r, 100));
      this.count = 0;
    }
    return fn();
  }
}

module.exports = RateLimiter;
