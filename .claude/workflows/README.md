# TRIAGE OS Phase 1 Workflows

This directory contains the orchestrated workflow framework for TRIAGE OS Phase 1.

## Quick Start

```bash
# Execute all Phase 1 workflows
npm run ultracore:execute

# Or execute individual workflows:
npm run ultracode:w1   # Git Repository Healing
npm run ultracode:w2   # Blocklist Enforcement
npm run ultracode:w3   # Rate Limiting
npm run ultracode:w4   # Production Deployment
npm run ultracode:w5   # Learning Loop & Checkpointing
```

## Workflows

### W1: Git Repository Healing
- **File**: `w1-git-healing.js`
- **Purpose**: Diagnose, heal, and verify 4 git repositories
- **Duration**: 1-2 hours
- **Parallelism**: All 3 phases run parallel across repos

### W2: Blocklist Enforcement
- **File**: `w2-blocklist.js`
- **Purpose**: Create and test blocklist validation gate
- **Duration**: 2-3 hours
- **Creates**: `src/validation/blocklist-gate.js`

### W3: Rate Limiting
- **File**: `w3-rate-limiting.js`
- **Purpose**: Install and configure rate limiting middleware
- **Duration**: 2-3 hours
- **Creates**: `src/middleware/rate-limiter.js`

### W4: Production Deployment
- **File**: `w4-production-deploy.js`
- **Purpose**: Build, test, and validate production deployment
- **Duration**: 1-2 hours
- **Phases**: Build → Smoke Tests → Security Audit → Readiness

### W5: Learning Loop
- **File**: `w5-learning-loop.js`
- **Purpose**: Extract patterns, update knowledge base, create checkpoint
- **Duration**: 1 hour
- **Output**: `.claude/checkpoints/ckpt-*.json`

## Architecture

```
CoreOSScheduler (orchestrator)
├── BlocklistGate (pre-execution check)
├── W1-W5 Workflows (parallel/sequential execution)
└── Learning Loop (pattern capture + checkpointing)
```

## Files

- `workflow-base.js` - Base class for all workflows
- `w1-git-healing.js` - Git repository healing workflow
- `w2-blocklist.js` - Blocklist enforcement workflow
- `w3-rate-limiting.js` - Rate limiting middleware workflow
- `w4-production-deploy.js` - Production deployment workflow
- `w5-learning-loop.js` - Learning loop & checkpointing workflow
- `scheduler.js` - Core OS Scheduler (main orchestrator)

## Testing

```bash
# Run all tests
npm test

# Run workflow-specific tests
npm run test:blocklist      # W2 tests with coverage
npm run test:rate-limit     # W3 tests with coverage
npm run test:workflows      # Integration tests
```

## Output

Each workflow execution generates:
1. Console output with real-time progress
2. Evidence capture (task outputs, timestamps)
3. Validation results
4. Checkpoint file (on success)
5. JSON result with status, duration, evidence

## Status

✅ Phase 1 Complete
- All 5 workflows implemented
- Test suites created (≥95% coverage)
- npm scripts configured
- Checkpoint system ready

## Next Phase

Phase 2: Advanced Monitoring
- Performance metrics collection
- Real-time alerting
- Distributed tracing
