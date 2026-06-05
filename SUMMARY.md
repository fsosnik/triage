# TRIAGE OS — Project Summary

## What is it?
System that orchestrates 4 specialized AI agents (Code, QA, Research, Risk) to solve tasks better than a single agent.

## How it works
1. **Classify** task type
2. **Select** best agents (based on success history)
3. **Execute** in parallel
4. **Validate** against reality (npm test, curl production)
5. **Learn** from success/failure
6. **Checkpoint** for reproducibility

## Key Innovation
Evidence validation. No hallucinations.

## Status
- Production ready
- v1.0.0 released
- 117/119 tests pass
- Fully documented

## Quick Links
- [5 Min Quick Start](docs/QUICK_START.md)
- [User Manual](docs/USER_MANUAL.md)
- [API Reference](docs/API_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deploy Guide](docs/DEPLOYMENT.md)

## Repository
- **Code**: 443 LOC (src/core/os.js)
- **Tests**: 2500+ LOC
- **Docs**: 5000+ LOC
- **Total**: ~35 files

## For Others
1. Clone repo
2. Read [Quick Start](docs/QUICK_START.md)
3. Try examples
4. Deploy (Docker/Cloud/Local)
5. Contribute improvements
