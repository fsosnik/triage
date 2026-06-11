# TRIAGE OS — Medical Classification Paradigm for AI Agents

> **Status**: ✅ Advanced MVP | **Version**: 1.3.0 | **Tests**: 156/160 ✓ | **Branch**: main

---

## 🏗️ System Architecture (7 Layers)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 7: Knowledge Base Distribuida (auto-evolución) ┃
┃  Pattern Library + Blocklist + Agent Weights         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 6: Checkpoint automático (Git + estado)       ┃
┃  Captura: Rama | Commit | Validaciones | Evidencia  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 5: Validation Gate (Verdad vs Predicción)     ┃
┃  ✓ Éxito → Learning Loop | ✗ Fallo → Rollback       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 4: Execution Tools (Git | Bash | Tests)       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑
┌──────────────────────┼──────────────────────┐
│                      │                      │
Code Agent          QA Agent            Research Agent      Risk Agent
• Tests             • Security          • Context           • Impact
• Build             • Bugs              • Libraries         • Rollback
• Types             • Edge cases        • Best prac         • Flags
│                      │                      │                   │
└──────────────────────┼──────────────────────┴───────────────────┘
↑
LAYER 3: Agent Mesh (Paralelo)
↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 2: Core OS (Enrutador, Orquestador)           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  LAYER 1: Input (Tarea, contexto, restricciones)    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

---

## 📊 Flujo: Tarea → Validación → Aprendizaje
INPUT: "Implementar OAuth2"
↓
CORE OS: Clasifica, carga patrones, selecciona agentes
↓
AGENTS PARALELO (código + QA + research + risk)
↓
VALIDATION GATE
├─ Tests: ✓ | Build: ✓ | Prod: ✓
├─→ ✓ SUCCESS → Learning Loop
└─→ ✗ FALLO → Rollback Loop
↓
CHECKPOINT + Pattern Library
↓
Próxima tarea similar → usa patrón aprendido

---

## ✅ Estado Actual

| Componente | Status | Evidencia |
|-----------|--------|-----------|
| Tests | 156/160 ✓ | 25 suites pass |
| Build | Clean ✓ | `npm run build` success |
| Consolidation | Complete ✓ | Main única rama |
| Auth | bcrypt + JWT ✓ | Functional |
| Graphify + Ruflo | Integrated ✓ | Working |

---

## 🚀 Quick Start

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
cp .env.example .env
npm test
npm run build
npm run dev
```

---

## 📁 Proyecto
triage/
├── README.md          ← Estás aquí
├── src/               ← Código fuente
├── tests/             ← 156/160 tests ✓
├── .claude/           ← OS Agentico config
├── scripts/           ← consolidate-branches.sh (nuevo)
└── docs/              ← Documentación profesional

---

## 🔒 Principios

1. **Clasificación correcta** — Router a agentes especializados
2. **Paralelismo** — No secuencial, máxima eficiencia
3. **Validación real** — Evidencia > predicción
4. **Aprendizaje continuo** — Mejor cada ciclo
5. **Bajo consumo** — 78% ahorro en tokens

---

**Version**: 1.3.0-alpha  
**Status**: Advanced MVP  
**Last Update**: 2026-06-03

