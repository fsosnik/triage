# Phase 23: Refactor + Testing

## Targets
1. Split src/core/os.js (359 LOC, cyclo 35)
   - os-orchestrator.js
   - os-router.js
   - os-validator.js
2. Reduce rollback-loop.js (253 LOC, cyclo 27)
3. Add integration tests (jest)
4. Benchmark: baseline vs optimized

## Timeline
- 1 week (40h)
- Mon: Code split
- Wed: Tests
- Fri: Benchmark + docs
