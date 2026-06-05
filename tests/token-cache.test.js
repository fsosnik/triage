const TokenCache = require('../src/optimization/token-cache');

describe('TokenCache', () => {
  let cache;
  beforeEach(() => {
    cache = new TokenCache(10);
  });

  test('caches and retrieves', () => {
    cache.set({ task: 'test' }, { result: 'data' });
    expect(cache.get({ task: 'test' })).toEqual({ result: 'data' });
  });

  test('tracks hit/miss', () => {
    cache.set({ a: 1 }, { x: 1 });
    cache.get({ a: 1 });
    cache.get({ a: 2 });
    const stats = cache.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
  });

  test('calculates savings', () => {
    cache.set({ test: 1 }, { result: 'cached' });
    cache.get({ test: 1 });
    const stats = cache.getStats();
    expect(stats.tokens_saved).toBe(150);
  });

  test('evicts old entries', () => {
    for (let i = 0; i < 12; i++) {
      cache.set({ n: i }, { result: i });
    }
    expect(cache.cache.size).toBeLessThanOrEqual(10);
  });
});
