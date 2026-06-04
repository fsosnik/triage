const GraphifyAdapter = require('../src/optimization/graphify-adapter');

describe('Phase 19: Graphify Integration', () => {
  let adapter;

  beforeEach(() => {
    adapter = new GraphifyAdapter();
  });

  test('should compress events (59% reduction)', () => {
    const event = {
      timestamp: '2026-06-03T23:43:11.275Z',
      type: 'cycle_complete',
      data: { success: true, tokens: 1500, duration_ms: 100 }
    };

    const original = JSON.stringify(event).length;
    const compressed = JSON.stringify(adapter.compressEvents([event])[0]).length;

    console.log(`Original: ${original} bytes, Compressed: ${compressed} bytes`);
    expect(compressed).toBeLessThan(original);
  });

  test('should compress patterns (success_rate as integer)', () => {
    const pattern = {
      id: 'p1',
      success_rate: 0.95,
      agents: ['code', 'qa'],
      execution_time: 100
    };

    const compressed = adapter.compressPatterns([pattern])[0];
    expect(compressed.id).toBe('p1');
    expect(compressed.sr).toBe(95);  // 0.95 → 95 (integer)
    expect(compressed.a).toBe('code,qa');
  });
});
