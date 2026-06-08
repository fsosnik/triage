const express = require('express');
const TriageOSCore = require('../core/triage-os-core');

class APIServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.core = new TriageOSCore();
    this.routes = [];
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'triage-os' });
    });
    this.routes.push({ method: 'GET', path: '/health' });

    // Execute cycle
    this.app.post('/cycle', async (req, res) => {
      try {
        const { task, agents, prediction } = req.body;
        const result = await this.core.executeCycle(task, agents, prediction);
        res.json({ status: 'success', data: result });
      } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
      }
    });
    this.routes.push({ method: 'POST', path: '/cycle' });
  }

  getRoutes() {
    return this.routes;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`\n🚀 TRIAGE OS running on http://localhost:${this.port}\n`);
    });
  }
}

// Exportar la clase
module.exports = APIServer;

// Solo levanta servidor si se ejecuta directamente
if (require.main === module) {
  const server = new APIServer(3000);
  server.start();
}
