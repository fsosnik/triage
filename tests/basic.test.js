/**
 * TRIAGE OS - Basic Tests
 */

const TRIAGEOS = require('../src/core/os');

describe('TRIAGE OS', () => {
  let triage;

  beforeEach(() => {
    triage = new TRIAGEOS();
  });

  test('should initialize with default config', () => {
    expect(triage.config.mode).toBe('agentic');
    expect(triage.config.parallelism).toBe(true);
  });

  test('should classify task types correctly', () => {
    expect(triage.classifyTaskType('implement new feature')).toBe('feature');
    expect(triage.classifyTaskType('fix bug')).toBe('bugfix');
    expect(triage.classifyTaskType('refactor code')).toBe('refactor');
  });

  test('should select appropriate agents', () => {
    const agents = triage.selectAgents({ task: 'implement API' }, null);
    expect(agents).toContain('code');
    expect(agents).toContain('qa');
  });

  test('should load patterns', () => {
    expect(Array.isArray(triage.patterns)).toBe(true);
  });

  test('should get metrics', () => {
    const metrics = triage.getMetrics();
    expect(metrics.total_cycles).toBe(0);
    expect(metrics.success_rate).toBeDefined();
  });
});
