const AnalyticsEngine = require('../src/analytics/analytics-engine');
const fs = require('fs');
const path = require('path');

describe('Phase 9: Analytics & Reporting', () => {
  beforeEach(() => {
    // Resetear events ANTES de cada test
    // Opción A: limpiar archivo
    const eventsFile = path.join(__dirname, '../.claude/analytics/events.json');
    if (fs.existsSync(eventsFile)) {
      fs.writeFileSync(eventsFile, JSON.stringify([]));
    }
  });

  test('AnalyticsEngine should record events', () => {
    const analytics = new AnalyticsEngine();
    analytics.events = []; // Forzar reset
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    expect(analytics.events.length).toBe(1);
  });

  test('should calculate success rate', () => {
    const analytics = new AnalyticsEngine();
    analytics.events = [];
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1500, duration_ms: 100 });
    analytics.recordEvent('cycle_complete', { success: false, tokens: 1200, duration_ms: 150 });
    expect(analytics.getSuccessRate()).toContain('50');
  });

  test('should get average tokens', () => {
    const analytics = new AnalyticsEngine();
    analytics.events = [];
    analytics.recordEvent('cycle_complete', { success: true, tokens: 1000 });
    analytics.recordEvent('cycle_complete', { success: true, tokens: 2000 });
    expect(analytics.getAverageTokens()).toBe(1500);
  });

  // ... resto de tests
});
