# TRIAGE OS — User Guide

## Start Here: 3 Ways to Use

### 1. Dashboard (Visual)
```bash
npm start
# Open http://localhost:3000
# Submit tasks visually
```

### 2. CLI (Script)
```bash
node examples/cli-example.js
```

### 3. Code (Programmatic)
```javascript
const TriageOS = require('triage-os');
const os = new TriageOS();
const result = await os.process({ task, context });
```

---

## Example 1: Fix Security Bug

**Task:** "Review and fix SQL injection vulnerability in auth module"

```javascript
const result = await os.process({
  task: "Fix SQL injection in /src/auth/login.js",
  context: "Node.js + Express + MySQL",
  constraints: [
    "Use parameterized queries",
    "All tests must pass",
    "No breaking changes to API"
  ]
});

// Automáticamente:
// Code Agent → parameterized queries + tests
// QA Agent → validates no injection possible
// Research Agent → checks best practices
// Risk Agent → evaluates rollback plan
```

---

## Example 2: Add Feature

**Task:** "Implement rate limiting for API endpoints"

```javascript
const result = await os.process({
  task: "Add rate limiting (100 req/min per IP)",
  context: "Express.js REST API, Redis available",
  constraints: [
    "Whitelist admin endpoints",
    "Tests required",
    "Monitor with Prometheus"
  ]
});
```

---

## Example 3: Refactor

**Task:** "Migrate from CommonJS to ES6 modules"

```javascript
const result = await os.process({
  task: "Convert src/ from CommonJS to ES6 import/export",
  context: "Node.js 18+, Jest tests",
  constraints: [
    "Tests must pass",
    "No API changes",
    "Git history preserved"
  ]
});
```

---

## What Each Agent Does

| Agent | Your Benefit |
|-------|--------------|
| **Code** | Writes code + runs tests automatically |
| **QA** | Finds bugs before production |
| **Research** | Researches best practices |
| **Risk** | Plans rollback if things break |

All 4 run **in parallel** = faster delivery.

---

## Real Output

```json
{
  "status": "VALIDATED",
  "task": "Fix SQL injection",
  "agents_executed": ["code", "qa", "research", "risk"],
  "evidence": {
    "tests": "225 pass",
    "build": "clean",
    "git": "main @ abc123d",
    "production": "live ✓"
  },
  "tokens_saved": "40%",
  "checkpoint": {
    "commit": "abc123d",
    "timestamp": "2026-06-05T18:45:00Z"
  }
}
```

---

## Common Use Cases

- 🔒 Security review + fix
- ✨ Add feature (with tests)
- 🐛 Debug + patch
- 📦 Refactor code
- 🚀 Deploy safely
- 📚 Update docs
- 🔄 Migrate libraries
- 🎯 Code review automation

