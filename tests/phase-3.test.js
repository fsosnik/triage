const TokenOptimizer = require('../src/optimization/token-optimizer');
const MetricsDashboard = require('../src/optimization/metrics-dashboard');

describe('Phase 3: Token Optimization', () => {
  
  describe('TokenOptimizer', () => {
    let optimizer;

    beforeEach(() => {
      optimizer = new TokenOptimizer();
    });

    test('should create cacheable prompt', () => {
      const prompt = optimizer.createCacheablePrompt('test', 'ephemeral');
      expect(prompt.type).toBe('text');
      expect(prompt.cache_control.type).toBe('ephemeral');
    });

    test('should compress patterns', () => {
      const patterns = [
        { id: 'p1', task_type: 'feature', agents: ['code', 'qa'], success_rate: 0.95, cost: 2000 },
        { id: 'p2', task_type: 'bugfix', agents: ['code'], success_rate: 0.6, cost: 1200 }
      ];
      const compressed = optimizer.compressPatterns(patterns);
      expect(compressed.length).toBeLessThan(JSON.stringify(patterns).length);
      expect(optimizer.metrics.compression_ratio).toBeGreaterThan(0);
    });

    test('should optimize context', () => {
      const patterns = [
        { id: 'p1', task_type: 'feature', success_rate: 0.95, last_used: new Date().toISOString() },
        { id: 'p2', task_type: 'feature', success_rate: 0.8, last_used: new Date(Date.now() - 86400000).toISOString() },
        { id: 'p3', task_type: 'bugfix', success_rate: 0.7, last_used: new Date().toISOString() }
      ];
      const optimized = optimizer.optimizeContext(patterns, 'feature', 2);
      expect(optimized.length).toBeLessThanOrEqual(2);
    });

    test('should create prompt template', () => {
      const template = optimizer.createPromptTemplate('feature');
      expect(template).toContain('Task:');
      expect(template).toContain('Agents:');
    });

    test('should estimate token savings', () => {
      const savings = optimizer.estimateSavings(10);
      expect(savings.savings_percent).toBeGreaterThan(0);
      expect(savings.cached_cost).toBeLessThan(savings.uncached_cost);
    });

    test('should track cache hits', () => {
      optimizer.recordCacheHit(2000);
      expect(optimizer.metrics.cache_hits).toBe(1);
    });

    test('should get metrics', () => {
      optimizer.recordCacheHit(1000);
      optimizer.recordOutput(500);
      const metrics = optimizer.getMetrics();
      expect(metrics).toHaveProperty('cache_hit_rate');
      expect(metrics).toHaveProperty('total_tokens');
    });
  });

  describe('MetricsDashboard', () => {
    let dashboard;

    beforeEach(() => {
      dashboard = new MetricsDashboard();
    });

    test('should capture snapshot', () => {
      const mockOS = {
        getMetrics: () => ({ total_cycles: 5, success_rate: '100%' }),
        patterns: [{ id: 'p1' }],
        blocklist: []
      };
      const mockOptimizer = {
        getMetrics: () => ({ cache_hits: 10 })
      };

      dashboard.captureSnapshot(mockOS, mockOptimizer);
      expect(dashboard.snapshots.length).toBe(1);
    });

    test('should get latest snapshot', () => {
      const snapshot = { timestamp: new Date().toISOString() };
      dashboard.snapshots.push(snapshot);
      expect(dashboard.getLatestSnapshot()).toEqual(snapshot);
    });

    test('should generate report', () => {
      const mockOS = {
        getMetrics: () => ({ total_cycles: 5, success_rate: '100%', patterns_learned: 8 }),
        patterns: [],
        blocklist: []
      };
      const mockOptimizer = {
        getMetrics: () => ({ cache_hit_rate: '50%', total_tokens: 5000 })
      };

      dashboard.captureSnapshot(mockOS, mockOptimizer);
      const report = dashboard.generateReport();
      expect(report).toContain('TRIAGE OS');
      expect(report).toContain('Total cycles');
    });
  });
});
