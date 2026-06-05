// example 2: express integration
const express = require('express');
const TRIAGEOS = require('triage');

const app = express();
const os = new TRIAGEOS();

app.post('/task', express.json(), async (req, res) => {
  const result = await os.orchestrate(req.body);
  res.json(result);
});

app.get('/metrics', (req, res) => {
  res.json(os.getMetrics());
});

app.listen(3000, () => console.log('Server running'));
