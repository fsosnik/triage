# TRIAGE OS — Agentic Self-Learning Operating System

Medical classification paradigm for AI agents. Real validation. Continuous learning. Automatic rollback.

## Status: Advanced MVP 🚀

**128/128 tests passing** | **23 test suites** | **0 lint errors** | **Production-ready roadmap**

> ⚠️ **Note**: This is an advanced MVP with solid architecture. See [AUDIT.md](#audit) for production readiness assessment.

---

## What is TRIAGE OS?

A 7-layer operating system for orchestrating AI agents that:

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
npm test        # 128/128 PASS ✅
npm run lint    # 0 errors
npm start       # API on localhost:3000
```

---

## Architecture (7 Layers)

### Layer 1: Input
- Task classification & routing

### Layer 2: Core OS
- `TriageOS` — Task classifier, agent router
- `TriageOSCore` — Cycle orchestrator

### Layer 3: Agent Mesh (4 Specialized Agents)
- **Code Agent**: Implementation + testing
- **QA Agent**: Security + bugs
- **Research Agent**: Context + best practices
- **Risk Agent**: Impact assessment + rollback planning

### Layer 4: Execution Tools
- Real tools: Git, Bash, npm, tests, curl
- No mock execution

### Layer 5: Validation Gate
- **Reality vs Prediction** arbitration
- Test validation
- Build validation
- Git status validation
- Production URL validation

### Layer 6: Learning Loop
- Pattern capture (successes)
- Pattern blocklist (failures)
- Agent weight adjustment

### Layer 7: Knowledge Base
- Pattern library (what works)
- Blocklist (what fails)
- Automatic evolution

---

## Core Capabilities

### ✅ What Works Today

- Real test execution (128/128 PASS)
- Git integration (status, diff, log)
- API server with health checks
- Pattern persistence
- Metrics collection
- Learning from successes

### 🚧 What's in Progress

Per [Audit Report](./AUDITORIA_COMPLETA_SISTEMAS_AI_2026-06-08.md):

- [ ] Production-grade authentication (hashing, expiration)
- [ ] Real validation gate (current: mock validators)
- [ ] Parallel agent execution (currently sequential)
- [ ] GitHub Actions CI/CD (tests.yml needs fix)
- [ ] Security hardening (RBAC, audit logging)

### ❌ What's Not Yet

- Multi-tenant support (designed, not implemented)
- Advanced visualization dashboard
- Distributed architecture

---

## Test Results
Test Suites: 23 passed, 23 total
Tests:       128 passed, 128 total
Time:        0.434 s
Coverage:    23 phases (Phase 1-23)

**Lint Status:**
0 errors
149 warnings (console statements, unused vars)

---

## Performance

- **Build time**: < 1s
- **Test execution**: 0.434s
- **Startup**: 150ms
- **API response**: < 50ms (localhost)

---

## <a name="audit"></a>Audit Status

**Comprehensive audit performed: 2026-06-08**

See [AUDITORIA_COMPLETA_SISTEMAS_AI_2026-06-08.md](./AUDITORIA_COMPLETA_SISTEMAS_AI_2026-06-08.md) for full report.

### Current Rating: 4.9/10
- ✅ Architecture: 7.5/10 (solid, well-designed)
- ⚠️ Implementation: 5/10 (mixed real + mock)
- ⚠️ Security: 2.5/10 (demo-grade only)
- ⚠️ Production readiness: Not ready

### What's Good
- Clear architecture
- Tests actually run
- Real integration (Git, npm, curl)
- Learning loop concept solid

### What Needs Work
- Validation gate uses mock validators
- Authentication is insecure (no hashing)
- Mixed reality/synthetic execution
- Documentation was inflated

### Path to Production

**Prioridad 1 (This week):**
1. Replace mock validators with real validation
2. Fix authentication (bcrypt, JWT)
3. Consolidate dual test suites ✅ DONE
4. Fix GitHub Actions workflow

**Prioridad 2 (Next 2 weeks):**
1. Parallel agent execution
2. Real audit logging
3. RBAC implementation
4. Reduce lint warnings

---

## Documentation

- [AI OS Operating System](./docs/AI_OPERATING_SYSTEM.md) — System philosophy
- [Architecture Deep Dive](./ARCHITECTURE.md) — 7-layer design
- [Audit Report](./AUDITORIA_COMPLETA_SISTEMAS_AI_2026-06-08.md) — Full assessment
- [Deployment Guide](./DEPLOYMENT.md) — How to run it

---

## Development

```bash
npm run dev      # Watch mode
npm test         # Run all tests
npm run lint     # ESLint check
npm run build    # Create dist/
npm start        # Start API server
npm run validate # Structural validation
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Note**: This project follows strict standards:
- No commits without passing tests
- No production claims without evidence
- Reality > Documentation
- All features verified end-to-end

---

## License

MIT — See LICENSE file

---

## Mantainer

**fsosnik** (@fsosnik)  
**GitHub**: https://github.com/fsosnik/triage

---

## Acknowledgments

- Graphify — Knowledge graph generation
- Ruflo — Tool execution
- Jest — Testing framework
- ESLint — Code quality

---

**Last Updated**: 2026-06-08  
**Audit Version**: 1.0  
**Project Status**: Advanced MVP, Production Roadmap Active
