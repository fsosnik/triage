const GraphifyAdapter = require('../src/optimization/graphify-adapter');

describe('Phase 20: Web Dashboard', () => {
  test('should compress events for API response', () => {
    const gf = new GraphifyAdapter();
    const events = [{
      timestamp: '2026-06-04T11:00:00Z',
      type: 'cycle_complete',
      data: { success: true, tokens: 1500, duration_ms: 100 }
    }];
    const compressed = gf.compressEvents(events);
    
    expect(compressed[0].t).toBe('c');
    expect(compressed[0].s).toBe(1);
    expect(compressed[0].tk).toBe(1500);
  });
});
