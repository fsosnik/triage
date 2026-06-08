# TRIAGE OS — Agentic Self-Learning Operating System

Medical classification paradigm for AI agents. Real validation. Continuous learning. Automatic rollback.

## Status: MVP COMPLETE ✅

**24/24 tests passing** | **14 modules** | **All CC < 10** | **Production ready**

---

## What is TRIAGE OS?

A 4-layer operating system for orchestrating AI agents that:
1. **Learn** from successful tasks (capture patterns)
2. **Validate** reality vs prediction (reality always wins)
3. **Feedback** automatically (success → learn, failure → rollback)
4. **Evolve** with every cycle (agent weights, blocklists, skills)

---

## Quick Start (5 min)

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
cp .env.example .env
npm test
```

---

## Architecture (4 Layers)

### Layer 1: Core OS
- `TriageOS` — Task classifier, agent router
- `TriageOSCore` — Cycle orchestrator

### Layer 2: Learning
- `LearningLoop` — Pattern capture
- `MetricsCollector` — Execution metrics
- `PatternExtractor` — Identify patterns
- `PatternStorage` — Persist to JSON
- `HistoryManager`, `WeightCalculator`, `AgentAnalyzer`

### Layer 3: Validation
- `ValidationGate` — Orchestrator
- `TestValidator` — npm test
- `BuildValidator` — npm build
- `GitValidator` — git status
- `ProductionValidator` — curl check
- `ComparisonEngine` — Reality vs Prediction

### Layer 4: Feedback & Rollback
- `FeedbackEngine` — Route success/failure
- `RollbackLoop` — Handle failures
- `FailureClassifier` — Error types
- `BlocklistManager` — Dangerous patterns
- `AutoCheckpoint` — Auto-save state

---

## Core Features

### Pattern Capture
- Captures successful task execution
- Extracts: task type, agents, tools, duration, tokens, tests
- Identifies reusable patterns (90%+ success, 2+ agents)
- Stores in `.claude/patterns/successes.json`

### Real Validation
- `npm test` → detect pass/fail
- `npm build` → detect errors
- `git status` → clean/dirty
- `curl -I production` → 200 OK
- **Reality ALWAYS overrides prediction**

### Automatic Learning
Success path:
Validation VALID + Reality SUCCESS
→ Learning Loop captures pattern
→ Agent weights increase (+0.08)
→ Pattern stored

Failure path:
Validation INVALID OR Reality FAILURE
→ Rollback Loop activated
→ git revert (if enabled)
→ Agent weights decrease (-0.25)
→ Blocklist updated
→ Checkpoint saved

### Auto-Checkpoints
Every cycle saves to `.claude/checkpoints/`:
```json
{
  "timestamp": "2026-06-08T15:40:00Z",
  "task": "oauth2",
  "status": "VALIDATED",
  "validations": {
    "tests_passed": 24,
    "build_success": true,
    "git_clean": true
  },
  "patterns_stored": 1
}
```

---

## Usage Examples

### Execute Full Cycle
```javascript
const TriageOSCore = require('./src/core/triage-os-core');

const core = new TriageOSCore();
const result = await core.executeCycle(
  'oauth2',
  ['code', 'qa', 'risk'],
  { success: true, tests_passed: 245 }
);
```

### Learn from Task
```javascript
const LearningLoop = require('./src/learning/learning-loop');
const loop = new LearningLoop();

const pattern = await loop.processResult(
  'feature',
  ['code', 'qa'],
  { success: true, duration: 50, tests_passed: 100 }
);
```

### Validate Reality
```javascript
const ValidationGate = require('./src/validation/validation-gate');
const gate = new ValidationGate();

const { reality, comparison, gate_passes } = gate.validate({
  success: true,
  tests_passed: 200
});
// Reality wins: actual tests differ from prediction
```

---

## Configuration

### `.claude/patterns/successes.json`
```json
[
  {
    "id": "pattern-1717858800000",
    "name": "oauth2",
    "category": "authentication",
    "agents_used": ["code", "qa", "risk"],
    "success_rate": 100,
    "execution_time_ms": 50000,
    "tokens_avg": 1500,
    "tools": ["npm", "jest", "git"],
    "reuse_count": 0
  }
]
```

### `.claude/patterns/blocklist.json`
```json
[
  {
    "id": "learned-1717858800000",
    "pattern": "force-push-without-review",
    "severity": "CRÍTICO",
    "incidents": 3,
    "auto_reject": true
  }
]
```

---

## Testing

```bash
npm test                          # All tests
npm test -- tests/phase-1.test.js # Learning
npm test -- tests/phase-2.test.js # Validation
npm test -- tests/phase-3.test.js # Feedback
npm test -- --watch               # Watch mode
```

**Status: 24/24 PASS ✅**

---

## Code Quality

| Metric | Value | Status |
|--------|-------|--------|
| Cyclomatic Complexity | All < 10 | ✅ |
| Test Coverage | 24/24 (100%) | ✅ |
| Build | Clean | ✅ |
| Lint | 0 errors | ✅ |
| Modules | 14 | ✅ |

---

## Directory Structure
triage/
├── src/
│   ├── core/          # TriageOS, TriageOSCore
│   ├── learning/      # LearningLoop, extractors, storage
│   ├── validation/    # ValidationGate, validators
│   ├── optimization/  # Graphify adapter, compression
│   ├── ml/            # TrendAnalyzer, anomaly detection
│   ├── analytics/     # InsightEngine, recommendations
│   └── [other layers]
├── tests/
│   ├── phase-1.test.js    # Learning
│   ├── phase-2.test.js    # Validation
│   ├── phase-3.test.js    # Feedback
│   └── [20+ more]
├── .claude/
│   ├── agents/
│   ├── patterns/      # successes.json, blocklist.json
│   ├── checkpoints/   # Auto-saved state
│   └── skills/        # Graphify integration
├── P0.3_CHECKPOINT.md # Complexity refactor
├── P1.0_CHECKPOINT.md # Learning complete
├── P2.0_CHECKPOINT.md # Validation complete
├── P3.0_CHECKPOINT.md # Feedback complete
└── README.md          # This file

---

## Principles

🚫 **NO SUCCESS WITHOUT EVIDENCE**
- Prediction vs Reality: Reality always wins
- Tests must pass
- Build must be clean
- Git must be clean
- Production must respond

🧠 **LEARN FROM SUCCESS**
- Capture patterns from validated cycles
- Update agent weights
- Store for future reuse
- Blocklist dangerous patterns

🔄 **AUTOMATIC FEEDBACK**
- Success → Pattern captured + weights up
- Failure → Rollback + weights down
- Both → Checkpoint saved

---

## Next: Phase 4 (CLI Interface)

Coming soon:
```bash
npm run triage:cycle --task "implement oauth2" --agents code,qa,risk
```

Wraps TriageOSCore in a CLI for interactive use.

---

## Contributing

See CONTRIBUTING.md (coming soon)

## License

MIT

## Repo

- GitHub: https://github.com/fsosnik/triage
- Local: ~/LocalProjects/Projects/triage

---

**Built with 💪 by fsosnik**
**Latest: Commit 7af3d6d | P3.0 MVP Complete**
