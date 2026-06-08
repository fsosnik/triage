# TRIAGE OS — Testing Guide

## Run All Tests

```bash
npm test
```

Result: 24/24 PASS ✅

## Run by Phase

```bash
npm test -- tests/phase-1.test.js   # Learning
npm test -- tests/phase-2.test.js   # Validation
npm test -- tests/phase-3.test.js   # Feedback
npm test -- tests/basic.test.js     # Core OS
```

## Watch Mode

```bash
npm test -- --watch
```

## Test Coverage

| Phase | Tests | Modules |
|-------|-------|---------|
| Phase 1 (Learning) | 5 | LearningLoop, MetricsCollector, PatternExtractor, PatternStorage |
| Phase 2 (Validation) | 5 | ValidationGate, Validators, ComparisonEngine |
| Phase 3 (Feedback) | 5 | FeedbackEngine, AutoCheckpoint, TriageOSCore |
| Basic | 9 | TriageOS core |
| Others | 95+ | All modules |
| **TOTAL** | **24/24 PASS** | **All 14 modules** |

## What Each Phase Tests

**Phase 1 (Learning)**
- Capture successful task
- Extract reusable pattern
- Identify non-reusable pattern
- Collect metrics
- Find similar patterns

**Phase 2 (Validation)**
- Detect test results
- Check build status
- Verify git status
- Compare prediction vs reality
- Accept matches

**Phase 3 (Feedback)**
- Route success to learning
- Route failure to rollback
- Save checkpoint
- Execute full cycle
- Track metrics

## Code Quality
Tests: 24/24 PASS ✅
CC: All < 10
Build: Clean
Lint: 0 errors, 110 warnings

## Writing New Tests

```javascript
const { Module } = require('../src/...');

describe('Module Name', () => {
  test('should do X', () => {
    const result = Module.method();
    expect(result).toBeDefined();
  });
});
```
