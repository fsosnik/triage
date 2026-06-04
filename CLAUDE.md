# TRIAGE OS

## Context
TRIAGE OS is an agentic operating system that orchestrates specialized agents.

## Stack
- Node.js 18+
- Claude AI (Anthropic API)
- GitHub Actions
- Notion (optional)

## Commands
- npm start → Run TRIAGE OS
- npm run docs:generate → Auto-generate documentation
- npm run validate:structure → Validate project structure
- npm test → Run tests

## Conventions
- English for code, Spanish for comments
- Minimal implementations
- Evidence-driven validation
- Parallel execution

## Never
- Push without validation
- Commit secrets to git
- Use --force-push
- Hardcode API keys

## Token Optimization (LAW)
**Graphify + Ruflo REQUIRED for all optimization decisions**

- Graphify (840 nodes): Use graph structure to select relevant context
- Ruflo (Complexity analysis): Identify refactoring targets BEFORE implementation
- Cache god nodes (degree > 20) for every orchestration cycle
- Pattern compression: 70% reduction (validated phase-19)
- Cache_control: Anthropic prompt caching on repeated patterns

**Non-negotiable:**
- Every task analyzes with Ruflo first (complexity check)
- Every context selection uses graphify-out/graph.json
- No hardcoded patterns - use graph communities
- Token budget: 4000/cycle max (vs 14612 baseline)

**Tools:**
- src/optimization/graphify-token-cache.js (production)
- Ruflo: /analyze, /refactor commands
- Dashboard: http://localhost:3000 (metrics)
