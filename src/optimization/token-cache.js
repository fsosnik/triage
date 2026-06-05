const crypto = require('crypto');

class TokenCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  hash(input) {
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
  }

  get(prompt) {
    const key = this.hash(prompt);
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key);
    }
    this.misses++;
    return null;
  }

  set(prompt, result) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    const key = this.hash(prompt);
    this.cache.set(key, result);
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hit_rate: total > 0 ? (this.hits / total * 100).toFixed(1) + '%' : '0%',
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      tokens_saved: this.hits * 150
    };
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

module.exports = TokenCache;
