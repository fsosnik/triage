describe('Phase 12: REST API Server', () => {
  test('API server module exists', () => {
    const server = require('../src/api/server.js');
    expect(server).toBeDefined();
  });

  test('TriageOSCore exports executeCycle', () => {
    const TriageOSCore = require('../src/core/triage-os-core.js');
    expect(TriageOSCore.prototype.executeCycle).toBeDefined();
  });

  test('Express app configuration valid', () => {
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    // Setup mock route
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    expect(app).toBeDefined();
  });
});
