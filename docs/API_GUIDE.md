# TRIAGE OS — API Guide

## Installation

```bash
npm install triage
# or
git clone https://github.com/fsosnik/triage.git
```

## Basic Example

```javascript
const TRIAGEOS = require('triage/src/core/os');

const os = new TRIAGEOS();
const result = await os.orchestrate({
  task: 'Implement user authentication',
  context: 'Next.js 14 + Supabase',
  constraints: ['no breaking changes', 'tests required', 'zero downtime']
});

console.log(result.status);           // SUCCESS | FAILED
console.log(result.metrics.agents_used);    // ['code', 'qa', 'research', 'risk']
console.log(result.metrics.total_tokens);   // 3500
```

## API Methods

### Constructor

```javascript
new TRIAGEOS(config)
```

**Config**:
```javascript
{
  mode: 'agentic',           // default
  parallelism: true,         // run agents in parallel
  max_concurrent: 4,         // max parallel agents
  validation_required: true, // validate results
  learning_enabled: true,    // learn from outcomes
  phase2_enabled: true       // use learning loops
}
```

### orchestrate(input)

Main method. Returns Promise.

**Input**:
```javascript
{
  task: string,              // required: "Implement feature X"
  context: string,           // optional: "Next.js 14, TypeScript"
  constraints: string[]      // optional: ["no downtime", "tests required"]
}
```

**Output**:
```javascript
{
  status: 'SUCCESS' | 'FAILED',
  results: {
    agents: [
      { agent: 'code', status: 'success', tokens: 500 },
      { agent: 'qa', status: 'success', tokens: 400 },
      { agent: 'research', status: 'success', tokens: 300 },
      { agent: 'risk', status: 'success', tokens: 412 }
    ],
    totalTokens: 1612
  },
  validation: { passed: true },
  checkpoint: { /* checkpoint data */ },
  metrics: {
    duration_ms: 2500,
    agents_used: ['code', 'qa', 'research', 'risk'],
    total_tokens: 1612
  }
}
```

### getMetrics()

```javascript
const metrics = os.getMetrics();
// Returns:
{
  total_cycles: 47,
  successful: 43,
  failed: 4,
  total_tokens: 75000,
  success_rate: '91.5%',
  avg_tokens: 1596,
  patterns_learned: 28,
  learning: {
    total_learning_events: 43,
    most_reliable_agent: { agent: 'code', rate: 0.94 },
    learning_trend: 'improving'
  }
}
```

## Properties

### patterns

```javascript
os.patterns  // Array of learned patterns
// [
//   {
//     id: 'pattern-123',
//     task_type: 'feature',
//     agents: ['code', 'qa', 'research', 'risk'],
//     success_rate: 0.92,
//     reuse_count: 5
//   }
// ]
```

### blocklist

```javascript
os.blocklist  // Array of blocked patterns
// [
//   {
//     id: 'force-push',
//     severity: 'CRÍTICO',
//     pattern: 'git push --force',
//     blocked: true
//   }
// ]
```

## Advanced Usage

### Custom Configuration

```javascript
const os = new TRIAGEOS({
  max_concurrent: 8,        // More parallelism
  learning_enabled: false   // Disable learning
});
```

### Accessing Learning State

```javascript
os.learning.updateAgentWeights(['code', 'qa'], true, 2500);
os.learning.getStats();
os.updater.predictBestAgents('feature', 4);
```

### Manual Pattern Management

```javascript
os.loadPatterns();        // Reload from disk
os.loadBlocklist();       // Reload from disk
os.savePatterns();        // Save to disk
```

## Error Handling

```javascript
try {
  const result = await os.orchestrate({
    task: 'Task description',
    context: 'Context'
  });
  
  if (result.status === 'FAILED') {
    console.error('Task failed:', result.error);
  }
} catch (error) {
  console.error('Orchestration error:', error.message);
}
```

## Integration Examples

### Express.js

```javascript
const express = require('express');
const TRIAGEOS = require('triage/src/core/os');

const app = express();
const os = new TRIAGEOS();

app.post('/task', async (req, res) => {
  const result = await os.orchestrate(req.body);
  res.json(result);
});

app.get('/metrics', (req, res) => {
  res.json(os.getMetrics());
});

app.listen(3000);
```

### CLI

```javascript
#!/usr/bin/env node
const TRIAGEOS = require('triage/src/core/os');

const os = new TRIAGEOS();
const [task, context] = process.argv.slice(2);

os.orchestrate({ task, context }).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
```

Usage:
```bash
./triage-cli.js "Implement feature" "Next.js 14"
```

### Docker

```javascript
// server.js
const express = require('express');
const TRIAGEOS = require('triage/src/core/os');

const app = express();
const os = new TRIAGEOS();

app.post('/orchestrate', express.json(), async (req, res) => {
  const result = await os.orchestrate(req.body);
  res.json(result);
});

app.listen(3000, () => console.log('TRIAGE OS running on :3000'));
```

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
```

## Rate Limiting

```javascript
const { RateLimiter } = require('triage/src/core/rate-limiter');
const limiter = new RateLimiter(10);  // 10 req/sec

limiter.execute(async () => {
  return await os.orchestrate(task);
});
```

## Token Management

```javascript
const { TokenOptimizer } = require('triage/src/optimization/token-optimizer');
const optimizer = new TokenOptimizer();

// Before: 14,612 tokens
// After: 4,000 tokens (75% savings)
const compressed = optimizer.optimize(context);
```

## Timeouts

```javascript
const { TimeoutManager } = require('triage/src/core/timeout-manager');
const tm = new TimeoutManager();

const result = await tm.executeWithTimeout(
  () => os.orchestrate(task),
  30000  // 30 second timeout
);
```
