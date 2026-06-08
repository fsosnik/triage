const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'triage-os' });
});

app.post('/cycle', async (req, res) => {
  try {
    const { task, agents, prediction } = req.body;
    
    if (!task || !agents) {
      return res.status(400).json({ error: 'Missing task or agents' });
    }

    // Importar TriageOSCore solo cuando se necesita (lazy load)
    const TriageOSCore = require('../core/triage-os-core');
    const core = new TriageOSCore();
    const result = await core.executeCycle(task, agents, prediction);

    res.json({ status: 'success', data: result });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/metrics', (req, res) => {
  res.json({ total_metrics: 0, success_rate: 0 });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 TRIAGE OS running on http://localhost:${PORT}`);
});
