# TRIAGE OS — User Guide

## What is TRIAGE OS?

An intelligent operating system that:
1. **Classifies** your tasks
2. **Routes** to specialized agents
3. **Validates** against reality (not prediction)
4. **Learns** from success
5. **Blocks** known failures

---

## Quick Start (5 minutes)

### 1. Start the server
```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm start
# 🚀 running on http://localhost:3000
```

### 2. Test the API
```bash
curl http://localhost:3000/health
# {"status":"ok","service":"triage-os"}
```

### 3. Execute a cycle
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "oauth2-implementation",
    "agents": ["code","qa"],
    "prediction": {"success": true}
  }'
```

---

## How to Use TRIAGE OS

### Endpoint: POST /cycle

Execute a full TRIAGE OS cycle with agents and validation.

**Request:**
```json
{
  "task": "feature-name",
  "agents": ["code", "qa", "knowledge"],
  "prediction": {
    "success": true,
    "tests_pass": true,
    "build_clean": true
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "validation": {
      "gate_passes": true,
      "verdict": "VALID"
    },
    "feedback": {
      "id": "pattern-xxx",
      "success_rate": 100,
      "pattern_captured": true
    },
    "checkpoint": "checkpoint-xxx.json",
    "agents": {
      "code": { "success": true, ... },
      "qa": { "success": true, ... },
      "knowledge": { "success": true, ... }
    }
  }
}
```

---

## Available Agents

### 1. Code Agent
**What it does**: Validates code execution, tests, typing
✓ Runs npm test
✓ Checks TypeScript
✓ Validates npm build

### 2. QA Agent
**What it does**: Security, bugs, edge cases
✓ Checks for hardcoded secrets
✓ Validates input sanitization
✓ Tests error handling

### 3. Knowledge Agent
**What it does**: Code analysis with Graphify + Ruflo
✓ Analyzes knowledge graph (Graphify)
✓ Measures complexity (Ruflo)
✓ Reports insights

### 4. Research Agent
**What it does**: Best practices, alternatives
✓ Searches for best practices
✓ Evaluates libraries
✓ Checks compatibility

### 5. Risk Agent
**What it does**: Impact and rollback planning
✓ Evaluates impact
✓ Plans rollback
✓ Identifies SPOF

---

## Common Tasks

### Task 1: Analyze Code
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "analyze-code",
    "agents": ["code", "qa", "knowledge"],
    "prediction": {"success": true}
  }'
```

### Task 2: Validate Feature
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "new-feature",
    "agents": ["code", "qa", "research", "risk"],
    "prediction": {"success": true}
  }'
```

### Task 3: Security Review
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "security-review",
    "agents": ["qa", "knowledge"],
    "prediction": {"success": true}
  }'
```

---

## Understanding Results

### Validation Gate
gate_passes: true   → All validators passed
verdict: VALID      → Reality matches prediction

### Feedback
success_rate: 100   → Task fully successful
pattern_captured    → Pattern learned for future use
checkpoint_saved    → State persisted

### Agents
Each agent returns:
{
"success": true,           // Agent executed successfully
"specific_output": {...}   // Agent-specific data
}

---

## Troubleshooting

### Port already in use
```bash
lsof -ti :3000 | xargs kill -9
npm start
```

### API not responding
```bash
curl -v http://localhost:3000/health
# Check if server is running
```

### Tests failing
```bash
npm test
# Review test output for failures
```

### Agents not executing
```bash
# Check if all dependencies installed
npm install
npm test
```

---

## Next Steps

1. **Run**: `npm start`
2. **Test**: `curl http://localhost:3000/health`
3. **Execute**: `POST /cycle` with your task
4. **Monitor**: Check responses for patterns captured
5. **Extend**: Add custom agents or validators

---

## Support

- **Docs**: See DOCUMENTATION_INDEX.md
- **Issues**: https://github.com/fsosnik/triage/issues
- **Email**: fersosnik@gmail.com

---

**Status**: Production Ready  
**Version**: 1.3.0-alpha.0  
**License**: MIT
