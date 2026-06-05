# TRIAGE OS — User Manual

## What is TRIAGE OS?

TRIAGE OS is an intelligent system that helps you make better decisions by routing tasks to 4 specialized experts (Code, QA, Research, Risk), validating results against reality, and learning from outcomes.

## Getting Started

### Installation
```bash
npm install triage
```

### Basic Usage
```javascript
const TRIAGEOS = require('triage');
const os = new TRIAGEOS();

const result = await os.orchestrate({
  task: 'Implement feature with tests',
  context: 'Next.js 14 + TypeScript',
  constraints: ['no breaking changes', 'tests required']
});

console.log(result.status);        // SUCCESS or FAILED
console.log(result.metrics);       // agents used, tokens, duration
```

## Task Types

### Feature Implementation
```javascript
await os.orchestrate({
  task: 'Implement user authentication',
  context: 'Node.js backend',
  constraints: ['secure', 'tests required']
});
```

### Bug Fixes
```javascript
await os.orchestrate({
  task: 'Fix memory leak in event handler',
  context: 'React app',
  constraints: ['no performance regression']
});
```

### Refactoring
```javascript
await os.orchestrate({
  task: 'Refactor database layer',
  context: 'PostgreSQL + Prisma',
  constraints: ['zero downtime', 'backward compatible']
});
```

## Understanding Results

```javascript
{
  status: 'SUCCESS',           // SUCCESS or FAILED
  results: {
    agents: [                  // What each agent did
      { agent: 'code', status: 'success' },
      { agent: 'qa', status: 'success' },
      { agent: 'research', status: 'success' },
      { agent: 'risk', status: 'success' }
    ],
    totalTokens: 3500
  },
  metrics: {
    duration_ms: 2500,
    agents_used: ['code', 'qa', 'research', 'risk'],
    total_tokens: 3500
  },
  checkpoint: {                // For reproducibility
    timestamp: '2026-06-05T14:00:00Z',
    agents_executed: ['code', 'qa', 'research', 'risk']
  }
}
```

## The 4 Agents

1. **Code Agent**: Writes code, runs tests, validates types
2. **QA Agent**: Finds bugs, security issues, edge cases
3. **Research Agent**: Best practices, external context, compatibility
4. **Risk Agent**: Impact assessment, rollback plans, contingencies

## How Learning Works

- **Success**: Agent weights increase (+0.15) → used more next time
- **Failure**: Agent weights decrease (-0.15) → used less next time
- **Patterns**: Successful solutions captured and reused
- **Blocklist**: Known failures prevented from repeating

## Dashboard

Access at `http://localhost:3000`

- `/health` — System status
- `/api/metrics` — Usage statistics
- Metrics include: cycles completed, success rate, patterns learned

## Best Practices

1. **Be specific**: Clear task descriptions → better results
2. **Add context**: Framework, language, environment matter
3. **Set constraints**: "no downtime", "backward compatible", etc.
4. **Check validation**: Each result validated against reality
5. **Review patterns**: Learn from successful cycles

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Task fails | Check constraints realistic? Add more context? |
| Slow execution | Parallel agents run in parallel; check network |
| Low success rate | Improve task description; add constraints |
| High token usage | Use Graphify optimization (see docs) |
