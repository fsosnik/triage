const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const GraphifyCompression = require('../optimization/graphify-compression');
const HealthCheck = require('./health-check');

class DashboardServer {
  constructor(port = 3000) {
    this.app = express();
    this.gf = new GraphifyCompression();
    this.hc = new HealthCheck();
    this.port = port;
    this.clients = new Set();
    this.os = null;
  }

  start(osInstance = null) {
    this.os = osInstance;

    this.app.get('/api/metrics', (req, res) => {
      const events = this.loadEvents();
      const compressed = this.gf.compressEvents(events);
      res.json({ data: compressed, compression: 'graphify' });
    });

    this.app.get('/api/patterns', (req, res) => {
      const patterns = this.loadPatterns();
      const compressed = this.gf.compressPatterns(patterns);
      res.json({ data: compressed });
    });

    this.app.get('/api/agents', (req, res) => {
      const file = '.claude/learning/agent-weights.json';
      const weights = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
      res.json(weights);
    });

    this.app.get('/health', (req, res) => {
      res.json(this.hc.check(this.os));
    });

    const server = require('http').createServer(this.app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });

    setInterval(() => {
      if (this.clients.size > 0) {
        const events = this.loadEvents().slice(-1);
        const compressed = this.gf.compressEvents(events);
        this.clients.forEach(client => {
          client.send(JSON.stringify({ type: 'event', data: compressed }));
        });
      }
    }, 2000);

    server.listen(this.port, () => {
      console.log(`✓ Dashboard: http://localhost:${this.port}`);
    });
  }

  loadEvents() {
    const file = '.claude/analytics/events.json';
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  }

  loadPatterns() {
    const file = '.claude/knowledge/patterns.json';
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  }
}

if (require.main === module) {
  const server = new DashboardServer();
  server.start();
}

module.exports = DashboardServer;
