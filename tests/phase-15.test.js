const TestSuite = require('../src/testing/test-suite');
const CoverageAnalyzer = require('../src/testing/coverage');
const IntegrationTest = require('../src/testing/integration-test');

describe('Phase 15: Advanced Testing', () => {
  
  test('TestSuite should run tests', async () => {
    const suite = new TestSuite('sample');
    suite.test('test 1', async () => { expect(1).toBe(1); });
    suite.test('test 2', async () => { expect(2).toBe(2); });
    
    const report = await suite.run();
    expect(report.passed).toBe(2);
  });

  test('should report failures', async () => {
    const suite = new TestSuite('sample');
    suite.test('pass', async () => { expect(1).toBe(1); });
    suite.test('fail', async () => { throw new Error('failed'); });
    
    const report = await suite.run();
    expect(report.failed).toBe(1);
  });

  test('CoverageAnalyzer should track coverage', () => {
    const analyzer = new CoverageAnalyzer();
    analyzer.track('app.js', [1, 2, 3, 4, 5]);
    analyzer.markCovered('app.js', [1, 2, 3]);
    
    const report = analyzer.getReport();
    expect(report.files[0].coverage).toBe('60.0%');
  });

  test('should check coverage threshold', () => {
    const analyzer = new CoverageAnalyzer();
    analyzer.track('app.js', [1, 2, 3, 4, 5]);
    analyzer.markCovered('app.js', [1, 2, 3, 4, 5]);
    
    expect(analyzer.threshold(100)).toBe(true);
  });

  test('IntegrationTest should execute scenarios', async () => {
    const test = new IntegrationTest();
    test.scenario('flow', [
      { name: 'step1', execute: async () => ({ success: true }) },
      { name: 'step2', execute: async () => ({ success: true }) }
    ]);
    
    const report = await test.runAll();
    expect(report.passed).toBe(1);
  });

  test('should handle scenario failures', async () => {
    const test = new IntegrationTest();
    test.scenario('flow', [
      { name: 'step1', execute: async () => ({ success: false }) }
    ]);
    
    const report = await test.runAll();
    expect(report.failed).toBe(1);
  });
});
