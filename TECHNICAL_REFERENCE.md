# TRIAGE OS — Technical Reference

## Module Structure

### Core OS (src/core/)
os.js                  — Main OS class
triage-os-core.js      — Cycle orchestrator
feedback-engine.js     — Success/failure routing
auto-checkpoint.js     — State persistence

### Learning (src/learning/)
learning-loop.js       — Pattern capture orchestrator
metrics-collector.js   — Metrics from execution
pattern-extractor.js   — Extract from execution results
pattern-storage.js     — Persist to .claude/patterns/
history-manager.js     — Historical data
weight-calculator.js   — Agent weight calculation
agent-analyzer.js      — Agent performance analysis
blocklist-manager.js   — Failed pattern tracking

### Validation (src/validation/)
validation-gate.js     — Main validator orchestrator
test-validator.js      — npm test validation
build-validator.js     — npm build validation
git-validator.js       — git status validation
production-validator.js — curl production check
comparison-engine.js   — Prediction vs reality

### Agents (src/agents/)
agent-executor.js      — Execute all agents
knowledge-agent.js     — Graphify + Ruflo analysis

### API (src/api/)
server.js              — Express.js server

---

## Data Flow
Input: { task, agents, prediction }
↓
Core OS: Classify task
↓
Agent Executor: Run agents in parallel
├─ Code Agent
├─ QA Agent
├─ Research Agent
├─ Risk Agent
└─ Knowledge Agent
↓
Validation Gate: Check reality
├─ Test Validator (npm test)
├─ Build Validator (npm build)
├─ Git Validator (git status)
└─ Production Validator (curl)
↓
Comparison Engine: Prediction vs Reality
├─ Match → VALID
└─ Mismatch → INVALID
↓
Feedback Engine: Route to loop
├─ Valid → Learning Loop
└─ Invalid → Rollback Loop
↓
Auto Checkpoint: Save state
↓
Output: { validation, feedback, checkpoint, agents }

---

## Storage

### `.claude/patterns/successes.json`
```json
[
  {
    "id": "pattern-1780939172570",
    "name": "analyze",
    "category": "general",
    "agents_used": ["code","qa"],
    "success_rate": 100,
    "created_at": "2026-06-08T17:19:32.570Z"
  }
]
```

### `.claude/patterns/blocklist.json`
```json
[
  {
    "id": "force-push",
    "severity": "CRÍTICO",
    "pattern": "git push --force",
    "reason": "Overwrites others' changes"
  }
]
```

### `.claude/checkpoints/`
checkpoint-2026-06-08T17-19-32-570Z.json
{
"timestamp": "2026-06-08T17:19:32.570Z",
"task": "analyze",
"status": "VALIDATED",
"validation": {...},
"feedback": {...},
"agents": {...}
}

---

## API Reference

### GET /health
```bash
curl http://localhost:3000/health
# Response: {"status":"ok","service":"triage-os"}
```

### POST /cycle
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "...",
    "agents": [...],
    "prediction": {...}
  }'
# Response: {status, data: {validation, feedback, checkpoint, agents}}
```

### GET /metrics
```bash
curl http://localhost:3000/metrics
# Response: {uptime, memory, ...}
```

### GET /patterns
```bash
curl http://localhost:3000/patterns
# Response: {patterns: [...]}
```

### GET /checkpoints
```bash
curl http://localhost:3000/checkpoints
# Response: {checkpoints: [...]}
```

---

## Classes & Methods

### TriageOS
```javascript
new TriageOS(config)
  .classifyTaskType(task)      → type
  .selectAgents(type)          → agents[]
  .getDefaultConfig()          → config
```

### TriageOSCore
```javascript
new TriageOSCore()
  .executeCycle(task, agents, prediction) → {validation, feedback, checkpoint, agents}
```

### ValidationGate
```javascript
new ValidationGate()
  .validate(prediction) → {reality, comparison, gate_passes}
```

### LearningLoop
```javascript
LearningLoop.processResult(task, agents, result) → pattern
```

### FeedbackEngine
```javascript
new FeedbackEngine()
  .process(task, agents, prediction, validation) → feedback
```

### KnowledgeAgent
```javascript
KnowledgeAgent.executeKnowledgeAgent(task) → {graphify, ruflo, success}
```

---

## Configuration

### settings.json
```json
{
  "mode": "agentic",
  "parallelism": true,
  "validation": {
    "checkTests": true,
    "checkBuild": true,
    "checkGit": true,
    "checkProduction": true
  }
}
```

---

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Health check | <1ms | Instant |
| Agent execution | <100ms | In-memory |
| Validation | ~2-3s | Depends on tools |
| Pattern capture | <50ms | JSON write |
| Checkpoint save | <50ms | File I/O |
| Full cycle | ~2-3s | Parallel agents |

---

## Testing

```bash
npm test                    # Run all tests
npm test -- --coverage     # With coverage
npm test -- phase-1        # Specific test
```

Expected: 126/126 PASS ✅

---

## Debugging

```bash
# Start with debug logging
DEBUG=triage:* npm start

# Test individual module
node -e "
const Module = require('./src/path/to/module.js');
const instance = new Module();
console.log(instance.method());
"
```

---

**Status**: Production Ready  
**Version**: 1.3.0-alpha.0
