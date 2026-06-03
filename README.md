# TRIAGE OS — Agentic & Self-Learning Operating System

> **Medical Classification Paradigm for AI Agents**  
> Orchestrates specialized agents, validates real evidence, learns from successes/failures, evolves automatically.

![Status](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Consumption](https://img.shields.io/badge/consumption-78%25_lower-green)

---

##  TRIAGE: ¿Qué es?

**TRIAGE** = Trinity (3) + Agile + Classification

En medicina, triage clasifica pacientes por urgencia. En TRIAGE OS:
- **Clasifica tareas** por tipo/complejidad
- **Enruta a agentes especializados** (paralelo)
- **Valida evidencia real** (no predicciones)
- **Aprende automáticamente** de cada ciclo
- **Minimiza consumo de tokens** (78% reduction)

---

##  Características Principales

| Feature | Benefit |
|---------|---------|
| **7-Layer Architecture** | Clear separation of concerns |
| **4 Specialized Agents** | Parallelism (5x faster) |
| **Evidence-Driven Validation** | Production > Documentation |
| **Auto-Learning System** | Gets smarter every cycle |
| **Pattern Library** | 78% token reduction through reuse |
| **Dynamic Blocklist** | Prevents repeated failures |
| **Low Consumption** | $0.60 USD/month vs $2.75 |
| **GitHub Actions** | Auto-documentation |

---

##  Consumo Esperado

```
SIN OPTIMIZAR:           CON TRIAGE:
Ciclo 1: 5,000 tokens    Ciclo 1: 3,500 tokens
Ciclo 2-10: 5,000 c/u    Ciclo 2: 1,500 tokens (-58%)
TOTAL: 55,000 tokens     Ciclo 3-10: 900 tokens (-80%)
Costo: $2.75 USD         TOTAL: 12,000 tokens
                         Costo: $0.60 USD
                         
AHORRO: 78% 🎉
```

---

##  Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
```

### 2. Setup Configuration
```bash
cp config/settings.example.json config/settings.json
cp config/patterns.example.json .claude/patterns/successes.json
cp config/blocklist.example.json .claude/patterns/blocklist.json
```

### 3. Create .env (don't commit)
```bash
echo "GITHUB_TOKEN=ghp_xxx" >> .env
echo "ANTHROPIC_API_KEY=sk-xxx" >> .env
```

### 4. Validate Setup
```bash
npm run validate:structure
```

### 5. Read Documentation
```
1. README.md (this file) ← YOU ARE HERE
2. docs/architecture/ARCHITECTURE.md (15 min)
3. docs/guides/LOW_CONSUMPTION.md (10 min)
4. docs/api/API_INTEGRATION.md (10 min)
```

---

##  Architecture: 7 Layers

```
┌──────────────────────────────────────┐
│ L7: Knowledge Base                   │
│ (Pattern Library + Blocklist)        │
├──────────────────────────────────────┤
│ L6: Checkpoint (Git + State)         │
├──────────────────────────────────────┤
│ L5: Validation Gate                  │
│ (Reality > Prediction)               │
│ ├─ Success → Learning Loop           │
│ └─ Failure → Rollback Loop           │
├──────────────────────────────────────┤
│ L4: Execution (Git, npm, tests)      │
├──────────────────────────────────────┤
│ L3: Agent Mesh (Parallel)            │
│ ├─ Code Agent                        │
│ ├─ QA Agent                          │
│ ├─ Research Agent                    │
│ └─ Risk Agent                        │
├──────────────────────────────────────┤
│ L2: Core OS (Orchestrator)           │
├──────────────────────────────────────┤
│ L1: Input (Task, Context, Constraints)
└──────────────────────────────────────┘
```

**See**: `docs/architecture/ARCHITECTURE.md`

---

##  4 Specialized Agents

### Code Agent
- **Implementación** + Testing
- **Tools**: Read, Edit, Bash, Git
- **Model**: claude-opus-4-6
- **Tokens**: 700-900

### QA Agent
- **Security** + Bugs
- **Tools**: Grep, Read, Bash
- **Model**: claude-sonnet-4-6
- **Tokens**: 400-600

### Research Agent
- **Context** + Best Practices
- **Tools**: Web Search, Read
- **Model**: claude-sonnet-4-6
- **Tokens**: 800-1200

### Risk Agent
- **Impact** + Rollback Planning
- **Tools**: Git, Bash, Read
- **Model**: claude-sonnet-4-6
- **Tokens**: 700-1000

**All agents execute in parallel** → 5x faster than sequential.

---

##  Project Structure

```
triage/
├── docs/
│   ├── architecture/ARCHITECTURE.md
│   ├── api/API_INTEGRATION.md
│   └── guides/LOW_CONSUMPTION.md
├── src/core/              (Core OS implementation)
├── src/agents/            (4 agents)
├── src/learning/          (Learning loops)
├── src/validation/        (Validation gates)
├── .claude/               (Claude integration)
├── .github/workflows/     (CI/CD automation)
├── config/                (Configuration templates)
├── tests/                 (Test suite)
└── scripts/               (Automation)
```

---

##  Tools & Integrations

### Priority 1: Essential (Week 1)
- ✅ GitHub API — Git operations
- ✅ Anthropic API — Multi-agent calls
- ✅ LocalStorage — Pattern persistence

### Priority 2: Important (Week 2)
- ⏳ Web Search — Research Agent
- ⏳ Notion MCP — Knowledge base
- ⏳ Claude Code — IDE integration

### Priority 3: Optional (Week 3+)
- ⏳ Slack MCP — Notifications
- ⏳ Cowork — Automation
- ⏳ NotebookLM — Document analysis

**Full details**: `docs/api/API_INTEGRATION.md`

---

##  Documentation

| Document | Time | Content |
|----------|------|---------|
| **ARCHITECTURE.md** | 15 min | 7 layers, flows, examples |
| **LOW_CONSUMPTION.md** | 10 min | 15 techniques, 45-78% savings |
| **API_INTEGRATION.md** | 10 min | Tools, MCPs, setup |
| **PROJECT_MANIFEST.md** | 5 min | Index, checklist, tasks |

**Start here**: `docs/architecture/ARCHITECTURE.md`

---

##  4-Week Roadmap

### Week 1: Foundation
```bash
npm run phase:1
# ✓ Core OS mínimo
# ✓ 2-3 ciclos completados
# ✓ 2-3 patterns captured
# → Consumo < 3,500 tokens/ciclo
```

### Week 2: Learning
```bash
npm run phase:2
# ✓ Learning Loop funcional
# ✓ Blocklist dinámico
# ✓ 5-8 patterns
# → Consumo < 1,500 tokens/ciclo
```

### Week 3: Optimization
```bash
npm run phase:3
# ✓ Pattern caching
# ✓ 15-20 patterns
# ✓ 70% pattern reuse
# → Consumo < 1,000 tokens/ciclo
```

### Week 4: Scale
```bash
npm run phase:4
# ✓ 30+ patterns
# ✓ Success rate > 90%
# ✓ Full automation
# ✓ Production-ready
```

---

##  Metrics

```bash
# Monitor consumption
npm run monitor:consumption

# Validate structure
npm run validate:structure

# Simulate a cycle
npm run simulate:cycle

# Update documentation
npm run docs:generate

# See all available scripts
npm run
```

---

##  Success Metrics (Month 1)

- [ ] Repo pushed to GitHub
- [ ] npm install works without errors
- [ ] 10+ patterns documented
- [ ] Success rate > 90%
- [ ] Token consumption < 15,000 for 10 cycles
- [ ] Blocklist prevents 95%+ of failures

---

##  Security

✅ `.env` in `.gitignore` — Never commit secrets  
✅ API keys in environment variables  
✅ Tokens rotated regularly  
✅ Auto-detection of dangerous patterns  
✅ Validation before every action  
✅ Automatic rollback on failure  

---

##  Contributing

1. Fork → Branch → Commit → PR
2. **Maintain evidence-driven principle**
3. Document before coding
4. Tests required

---

##  Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Docs**: `/docs` folder

---

##  License

MIT — Free to use, modify, distribute.

---

##  What You'll Learn

✅ Agentic system design  
✅ API consumption optimization  
✅ ML pattern recognition  
✅ Scalable architecture  
✅ Professional documentation  
✅ GitHub automation  

---

##  Credits

**Trinity** — Inspired by my daughter  
**TRIAGE** — Medical classification paradigm for AI  
**Evidence-Driven** — Truth over prediction  

---

**Version**: 0.1.0  
**Status**: 🟡 Phase 1 Development  
**Last Updated**: 2026-06-03  
**Author**: [@fsosnik](https://github.com/fsosnik)

---

##  Ready?

```bash
1. git clone https://github.com/fsosnik/triage.git
2. cd triage && npm install
3. Read: docs/architecture/ARCHITECTURE.md
4. Start: npm run phase:1
```

**¡Let's build something amazing! 🎉**
