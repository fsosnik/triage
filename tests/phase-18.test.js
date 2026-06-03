const PatternPredictor = require('../src/ml/pattern-predictor');
const AnomalyDetector = require('../src/ml/anomaly-detector');
const TrendAnalyzer = require('../src/ml/trend-analyzer');

describe('Phase 18: Advanced Analytics & ML', () => {
  
  test('PatternPredictor should predict success', () => {
    const pp = new PatternPredictor();
    pp.observe('auth', 'success', 100, 500);
    pp.observe('auth', 'success', 120, 550);
    pp.observe('auth', 'fail', 80, 400);
    
    const prediction = pp.predictSuccess('auth');
    expect(prediction).toBe(2/3);
  });

  test('should predict tokens', () => {
    const pp = new PatternPredictor();
    pp.observe('api', 'success', 100, 1000);
    pp.observe('api', 'success', 100, 1000);
    
    const prediction = pp.predictTokens('api');
    expect(prediction).toBe(1000);
  });

  test('should get insights', () => {
    const pp = new PatternPredictor();
    pp.observe('task1', 'success', 100, 500);
    const insights = pp.getInsights();
    expect(insights.length).toBeGreaterThan(0);
  });

  test('AnomalyDetector should detect anomalies', () => {
    const ad = new AnomalyDetector(2.0);
    for (let i = 0; i < 10; i++) ad.addMetric('latency', 100);
    ad.addMetric('latency', 500); // Anomaly
    
    const report = ad.report();
    expect(report.anomalies_found).toBeGreaterThan(0);
  });

  test('TrendAnalyzer should calculate trend', () => {
    const ta = new TrendAnalyzer();
    ta.addDataPoint('success_rate', 0.7);
    ta.addDataPoint('success_rate', 0.75);
    ta.addDataPoint('success_rate', 0.8);
    
    const trend = ta.calculateTrend('success_rate');
    expect(trend).toBe('improving');
  });

  test('should predict next value', () => {
    const ta = new TrendAnalyzer();
    ta.addDataPoint('cpu', 50);
    ta.addDataPoint('cpu', 55);
    
    const next = ta.predictNext('cpu');
    expect(next).toBeDefined();
  });
});
