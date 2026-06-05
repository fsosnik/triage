# TRIAGE OS — Examples

## Example 1: Basic Usage

```javascript
const TriageOS = require('triage-os');
const os = new TriageOS();

async function implementAuth() {
  const result = await os.orchestrate({
    task: 'Implement JWT authentication',
    context: 'Express.js + TypeScript + PostgreSQL',
    constraints: ['Secure token storage', 'Refresh token rotation', 'Tests required']
  });

  console.log('Status:', result.status);
  console.log('Build passed:', result.validations.npm_build);
}

implementAuth();
```

## Example 2: Feature with Risk Assessment

```javascript
async function deployNewFeature() {
  const result = await os.orchestrate({
    task: 'Add real-time notifications',
    context: { framework: 'Next.js 14', users: '50K', sla: '99.9%' },
    constraints: ['Blue-green deployment', 'Feature flag required']
  });

  if (result.status === 'VALIDATED') {
    console.log('✓ Ready to deploy');
    console.log('Rollback:', result.output.rollback_plan);
  }
}

deployNewFeature();
```

## Example 3: Bug Fix with Validation

```javascript
async function fixMemoryLeak() {
  const result = await os.orchestrate({
    task: 'Fix memory leak in payment webhook',
    context: 'Node.js, Heroku, 100K events/day',
    constraints: ['Root cause analysis', 'Prevent recurrence', 'No downtime'],
    agents: ['code_agent', 'qa_agent', 'research_agent']
  });

  if (result.validations.npm_test && result.validations.production) {
    return result.checkpoint;
  }
}
```

## Example 4: Monitor & Learn

```javascript
const metrics = os.getMetrics();
console.log(`Success rate: ${metrics.success_rate * 100}%`);
console.log(`Patterns learned: ${metrics.patterns}`);

const blocklist = os.getBlocklist();
blocklist.forEach(block => {
  if (block.severity === 'CRÍTICO') {
    console.log(`🚫 ${block.id}: ${block.reason}`);
  }
});
```

## Example 5: Custom Agents

```javascript
await os.orchestrate({
  task: 'Optimize database',
  agents: ['code_agent'],
  context: 'PostgreSQL, 1M rows'
});
```

## Example 6: Express Integration

```javascript
const express = require('express');
const TriageOS = require('triage-os');

const app = express();
const os = new TriageOS();

app.post('/api/task', async (req, res) => {
  const result = await os.orchestrate(req.body);
  res.json({
    status: result.status,
    checkpoint: result.checkpoint,
    metrics: os.getMetrics()
  });
});

app.listen(3000);
```
