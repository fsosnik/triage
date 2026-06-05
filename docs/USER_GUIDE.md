# TRIAGE OS — User Guide

## What is TRIAGE OS?

TRIAGE OS is a self-learning agentic OS that orchestrates specialized AI agents (Code, QA, Research, Risk) to solve complex tasks. It validates everything against reality, learns from successes, and blocks known-failure patterns.

## Install

```bash
npm install triage-os
```

## Quick Start

```javascript
const TriageOS = require('triage-os');
const os = new TriageOS();

const result = await os.orchestrate({
  task: 'Add OAuth2 to API',
  context: 'Express.js, PostgreSQL',
  constraints: ['No downtime', 'Tests required']
});

console.log(result);
```

## Agents

| Agent | Task |
|-------|------|
| Code | Implementation, tests |
| QA | Bugs, security |
| Research | Best practices |
| Risk | Impact, rollback |

## Metrics

```javascript
const m = os.getMetrics();
// { success_rate, patterns, blocklist, agent_weights }
```

See **API_REFERENCE.md** for all methods.
