# TRIAGE OS — Agentic Operating System for Claude

An intelligent, self-learning orchestration system that coordinates multiple specialized AI agents to solve complex tasks with real-world validation, continuous learning, and token optimization.

## What is TRIAGE OS?

TRIAGE OS is a **7-layer agentic operating system** that directs tasks to the right specialists, validates results against reality, learns from failures, and optimizes token usage through semantic knowledge graphs. Instead of one AI making decisions, TRIAGE deploys a **team of experts**: Code Agent (implementation), QA Agent (security/bugs), Research Agent (best practices), Risk Agent (rollback).

## How It Works

1. **Classification**: Detects task type (feature/bugfix/refactor)
2. **Pattern Detection**: Graphify (840 nodes) selects relevant context
3. **Agent Selection**: Chooses specialists based on historical success rates
4. **Parallel Execution**: 4 agents run simultaneously with specialized tools
5. **Validation Gate**: Tests against reality (npm test, npm build, curl production) → ✅ PASS = Learning Loop (+0.15 weight) | ❌ FAIL = Rollback Loop (-0.15 weight, blocklist)
6. **Learning**: Updates agent weights, captures success patterns
7. **Checkpoint**: Saves complete state for reproducibility

## Architecture
LAYER 7: Knowledge Base (Graphify 840 nodes + Learning)
LAYER 6: Checkpoint & Metrics (Persistence)
LAYER 5: Validation Gate (Truth > Prediction)
├─ Success → Learning Loop
└─ Failure → Rollback + Blocklist
LAYER 4: Execution Tools (Git, Bash, Tests, APIs)
LAYER 3: Agent Mesh (Code, QA, Research, Risk)
LAYER 2: Core OS (Orchestrator, Router)
LAYER 1: Input (Task, Context, Constraints)

## Key Features

**Self-Learning**: Blocklist prevents repeating failures, pattern library grows with success, 95%+ success rate after learning phase. **Reality-Driven**: Production validates all claims, real execution (npm test/build, curl production), rollback on failure. **Token Optimization**: Baseline 14,612 → Target 4,000 tokens/cycle (75% savings) via Graphify context selection (840 → 10-20 nodes). **Integration**: GitHub MCP, Slack MCP, Mem MCP, multi-tenant support, load balancer. **Observable**: Graphify visualization, Ruflo complexity analysis, metrics dashboard, health endpoint, benchmark runner.

## Status

| Phase | Feature | Status |
|-------|---------|--------|
| 0-18 | Core OS, Learning, Validation | ✅ Complete |
| 19-21 | Graphify, Dashboard | ✅ Complete |
| 22-23 | Refactoring, Complexity | ✅ Complete |
| 24-25 | Token Optimization, Production | ✅ Complete |
| 26 | MCPs + Scaling | ✅ Complete |
| 27 | Benchmarking | 🔄 In Progress |

**Tests**: 109/115 pass (95%)

## Installation

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm test
npm run dev
curl http://localhost:3000/health
```

## Token Optimization Law

Graphify + Ruflo REQUIRED for all optimization. Before implementation: (1) `npx ruflo analyze complexity src/`, (2) Load graphify-token-cache, (3) Use graph.json communities, (4) Apply cache_control.

## Design Principles

1. **Evidence > Prediction**: Real results override assumptions
2. **Failure = Learning**: Every error updates blocklist
3. **Parallelism**: 4 agents simultaneous
4. **Resilience**: Automatic rollback
5. **Optimization**: Graph-driven context (75% savings)
6. **Observability**: All decisions logged

---

Built with: Node.js, Anthropic Claude API, Graphify, Ruflo
