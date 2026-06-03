const TokenOptimizer = require('../src/optimization/token-optimizer');
const MetricsDashboard = require('../src/optimization/metrics-dashboard');

describe('Phase 3: Token Optimization', () => {
  
  describe('TokenOptimizer', () => {
    let optimizer;

    beforeEach(() => {
      optimizer = new TokenOptimizer();
    });

    test('should compress patterns', () => {
      const patterns = [
        { id: 'p1', task_type: 'feature', agents: ['code', 'qa'], success_rate: 0.95, cost: 2000 }
      ];
      optimizer.compressPatterns(patterns);
      expect(Number(optimizer.metrics.compression_ratio)).toBeGreaterThan(0);
    });

    test('should estimate token savings', () => {
      const savings = optimizer.estimateSavings(10);
      expect(Number(savings.savings_percent)).toBeGreaterThan(0);
    });

    test('should track cache hits', () => {
      optimizer.recordCacheHit(2000);
      expect(optimizer.metrics.cache_hits).toBe(1);
    });
  });

  describe('MetricsDashboard', () => {
    let dashboard;

    beforeEach(() => {
      dashboard = new MetricsDashboard();
    });

    test('should generate report', () => {
      const mockOS = {
        getMetrics: () => ({ total_cycles: 5 }),
        patterns: [],
        blocklist: []
      };
      const mockOptimizer = {
        getMetrics: () => ({ cache_hit_rate: '50%' })
      };

      dashboard.captureSnapshot(mockOS, mockOptimizer);
      const report = dashboard.generateReport();
      expect(report).toContain('TRIAGE OS');
    });
  });
});
