# TRIAGE OS — Agentic Operating System

**Production-ready orchestration engine for AI agents with knowledge graph + token optimization.**

![Status](https://img.shields.io/badge/status-production-green) ![Version](https://img.shields.io/badge/version-1.2.1-blue) ![Tests](https://img.shields.io/badge/tests-225%2F234-brightgreen)

## Features

- **4 Specialized Agents**: Code, QA, Research, Risk
- **Graphify Integration**: 840-node knowledge graph for pattern matching
- **Ruflo Optimizer**: 40% token savings via prompt compression
- **Multi-LLM**: Claude, GPT-4, Gemini, Ollama
- **Validation Gate**: Real evidence > prediction
- **Learning Loop**: Auto-improves via pattern capture
- **Production Dashboard**: Real-time monitoring

## Quick Start

```bash
npm install triage-os

# Or from GitHub
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm test
npm start
```

## Usage

```javascript
const TriageOS = require('triage-os');

const os = new TriageOS();
const result = await os.process({
  task: "Implement authentication",
  context: "Node.js + Express",
  constraints: ["No hardcoded secrets", "Tests required"]
});

console.log(result);
// {
//   status: 'VALIDATED',
//   agents: ['code', 'qa', 'risk'],
//   tokens_saved: '40%',
//   checkpoint: { commit: 'abc123', tests: 'pass' }
// }
```

## Architecture

**7-Layer Stack:**
1. Input (task + context)
2. Core OS (routing + validation)
3. Agent Mesh (parallel execution)
4. Execution Tools (Git, Bash, Tests, APIs)
5. Validation Gate (evidence-based)
6. Learning Loop (pattern capture)
7. Knowledge Base (auto-evolution)

[Full Architecture](docs/architecture/ARCHITECTURE.md)

## Agents

| Agent | Role | Tools |
|-------|------|-------|
| Code | Implementation + Tests | npm, tsc, git |
| QA | Security + Bugs | grep, custom validators |
| Research | Best practices | Web search, docs |
| Risk | Impact + Rollback | git diff, feature flags |

## Configuration

Copy `.env.example`:
```bash
cp .env.example .env
```

Edit with:
- `ANTHROPIC_API_KEY` (or OpenAI/Gemini)
- `TRIAGE_PROVIDER` (anthropic/openai/gemini/ollama)
- `GITHUB_TOKEN` (optional, for integrations)

## Usage Examples

See [USER_GUIDE.md](docs/USER_GUIDE.md) for real examples.

## Testing

```bash
npm test              # Run all tests (225/234 pass)
npm run validate      # Validate structure
npm run benchmark     # Performance test
```

## Production

```bash
npm start             # Start dashboard on :3000
pm2 start src/server/dashboard-server.js --name triage
```

Health check: `curl http://localhost:3000/health`

## Documentation

- [QUICKSTART.md](QUICKSTART.md) — 5-min setup
- [docs/GRAPHIFY_RUFLO.md](docs/GRAPHIFY_RUFLO.md) — Knowledge graph + token optimization
- [docs/PROVIDERS.md](docs/PROVIDERS.md) — Multi-LLM setup
- [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) — Full spec

## Status

- ✅ Core OS (7 layers)
- ✅ 4 Agents (code, qa, research, risk)
- ✅ Graphify integration (840 nodes)
- ✅ Ruflo optimizer (40% savings)
- ✅ Multi-LLM providers (6 types)
- ✅ Learning loop + rollback
- ⚠️ 9 phase tests (pre-existing logic bugs, v1.3 roadmap)

## Roadmap (v1.3+)

- Command injection allowlist
- Persistent session storage (Redis/SQLite)
- E2E tests (Jest/ESM resolution)
- Audit logging (non-repudiation)
- Feature flags (gradual rollout)

## Links

- NPM: https://www.npmjs.com/package/triage-os
- GitHub: https://github.com/fsosnik/triage
- Dashboard: http://localhost:3000 (after `npm start`)

## License

MIT
