const express = require('express');
const TriageOSCore = require('../core/triage-os-core');

const app = express();
app.use(express.json());

const core = new TriageOSCore();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'triage-os' });
});

// Execute cycle
app.post('/cycle', async (req, res) => {
  try {
    const { task, agents, prediction } = req.body;

    if (!task || !agents || !prediction) {
      return res.status(400).json({
        error: 'Missing required fields: task, agents, prediction'
      });
    }

    const result = await core.executeCycle(task, agents, prediction);

    res.json({
      status: 'success',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Get metrics
app.get('/metrics', (req, res) => {
  const metrics = core.feedback.learning.getMetrics();
  res.json(metrics);
});

// List patterns
app.get('/patterns', (req, res) => {
  const PatternStorage = require('../learning/pattern-storage');
  const patterns = PatternStorage.load();
  res.json({ count: patterns.length, patterns });
});

// List checkpoints
app.get('/checkpoints', (req, res) => {
  const AutoCheckpoint = require('../core/auto-checkpoint');
  const list = AutoCheckpoint.list();
  res.json({ count: list.length, checkpoints: list });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 TRIAGE OS API running on http://localhost:${PORT}`);
  console.log(`POST /cycle — Execute a cycle`);
  console.log(`GET /health — Health check`);
  console.log(`GET /metrics — System metrics`);
  console.log(`GET /patterns — Learned patterns`);
  console.log(`GET /checkpoints — Saved checkpoints`);
});
