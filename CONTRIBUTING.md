# Contributing to TRIAGE OS

## Setup
```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm test
```

## Requirements
- Tests must pass (107/119 minimum)
- Node.js 18+
- Follow code style

## Workflow
1. Create branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test: `npm test`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/your-feature`
6. PR to main

## Code Standards
- Use graphify + Ruflo for optimization decisions
- No hardcoded secrets
- All async operations need timeout handling
- Document changes in CHANGELOG.md

## Issues
Report via GitHub Issues with:
- TRIAGE version
- Node version
- Error output
- Reproduction steps
