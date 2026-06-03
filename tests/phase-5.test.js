const Monitor = require('../src/observability/monitor');
const Alerting = require('../src/observability/alerting');
const Dashboard = require('../src/observability/dashboard');

describe('Phase 5: Observability', () => {
  
  describe('Monitor', () => {
    let monitor;

    beforeEach(() => {
      monitor = new Monitor();
    });

    test('should record metrics', () => {
      monitor.recordMetric('cycles_total', 10);
      expect(monitor.metrics.cycles_total).toBe(10);
    });

    test('should get health status', () => {
      const health = monitor.getHealthStatus();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('uptime_seconds');
    });

    test('should emit alerts on threshold breach', (done) => {
      monitor.on('alert', (alert) => {
        expect(alert.level).toBe('warning');
        done();
      });
      monitor.recordMetric('latency_ms', 6000);
    });

    test('should track errors', () => {
      monitor.recordMetric('errors_total', 5);
      expect(monitor.metrics.errors_total).toBe(5);
    });
  });

  describe('Alerting', () => {
    let monitor, alerting;

    beforeEach(() => {
      monitor = new Monitor();
      alerting = new Alerting(monitor);
    });

    test('should register handler', () => {
      const handler = jest.fn();
      alerting.registerHandler(handler);
      expect(alerting.handlers.length).toBe(1);
    });

    test('should track alert history', () => {
      alerting.handleAlert({ level: 'critical', metric: 'test' });
      expect(alerting.getAlertHistory().length).toBe(1);
    });

    test('should get severity distribution', () => {
      alerting.handleAlert({ level: 'critical' });
      alerting.handleAlert({ level: 'warning' });
      const dist = alerting.getSeverityDistribution();
      expect(dist.critical).toBe(1);
      expect(dist.warning).toBe(1);
    });
  });

  describe('Dashboard', () => {
    let dashboard, monitor, alerting;

    beforeEach(() => {
      monitor = new Monitor();
      alerting = new Alerting(monitor);
      dashboard = new Dashboard(monitor, alerting);
    });

    test('should render CLI dashboard', () => {
      const cli = dashboard.renderCLI();
      expect(cli).toContain('TRIAGE OS Dashboard');
      expect(cli).toContain('Status:');
    });

    test('should render JSON export', () => {
      const json = dashboard.renderJSON();
      expect(json).toHaveProperty('health');
      expect(json).toHaveProperty('alerts');
    });

    test('should export in format', () => {
      const json = dashboard.export('json');
      expect(json).toHaveProperty('timestamp');
    });
  });
});
