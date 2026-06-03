# ARCHITECTURE.md — Sistema Operativo Agentico

**Diseñado para**: Máxima eficiencia (bajo consumo), autoaprendizaje, validación real.

---

## 1. Principios de Bajo Consumo

### 1.1 Reutilización de Contexto

**NO HACER** (❌ Alto consumo):
```
Ciclo 1: 5000 tokens (prompt completo)
Ciclo 2: 5000 tokens (reescribir todo)
Ciclo 3: 5000 tokens (repetir información)
Total: 15,000 tokens para 3 ciclos similares
```

**SÍ HACER** (✅ Bajo consumo):
```
Ciclo 1: 5000 tokens (prompt completo + guardar patrón)
Ciclo 2: 1200 tokens (cargar patrón, solo delta)
Ciclo 3: 800 tokens (patrón conocido, ajustes mínimos)
Total: 7,000 tokens para 3 ciclos similares (53% menos)
```

### 1.2 Pattern Library (Reutilizar soluciones)

Cada patrón guarda:
- **Qué se hizo** (agents used, tools)
- **Cómo se hizo** (steps)
- **Cuánto costó** (token_cost)
- **Success rate** (% de reuso)

**Formato mínimo**:
```json
{
  "id": "oauth2-setup",
  "agents": ["code", "qa", "risk"],
  "tools": ["npm", "git", "tsc"],
  "cost": 2100,
  "success_rate": 0.95,
  "reuse_count": 7
}
```

### 1.3 Paralelismo (No secuencial)

**❌ Secuencial** (lento, alto consumo):
```
Code Agent (5 min)
  → QA Agent (3 min)
    → Research Agent (2 min)
      → Risk Agent (2 min)
Total: 12 min, cada agente espera
```

**✅ Paralelo** (rápido, eficiente):
```
Code Agent (5 min)  ║
QA Agent (3 min)    ║  → Simultáneo
Research Agent (2 min) ║
Risk Agent (2 min)     ║
Total: 5 min (2.4x más rápido)
```

---

## 2. Arquitectura de 7 Capas

### LAYER 1: Input

**Estructura mínima del prompt**:
```
TAREA: [Una frase]
CONTEXTO: [Referencia a patrón existente O breve descripción]
RESTRICCIONES: [Máximo 3 items]
PRIORIDAD: [CRÍTICO|ALTO|NORMAL]
```

**Ejemplo (78 tokens)**:
```
TAREA: Implementar rate limiting para auth endpoints

CONTEXTO: Patrón previo "oauth2-setup" + rate-limiting docs en repo

RESTRICCIONES:
- No romper tests existentes
- Producción sin downtime
- Documentar en README

PRIORIDAD: ALTO
```

### LAYER 2: Core OS (Orquestador)

**Pseudocódigo mínimo**:
```python
def orchestrate(task, context, restrictions):
    # 1. Buscar patrón similar (O(1) en Memory)
    pattern = pattern_library.find_similar(task)
    
    if pattern.exists and pattern.success_rate > 0.8:
        # REUSO: Cargar agentes del patrón previo
        agents = pattern.agents
        cost = "BAJO" (1.2K tokens)
    else:
        # NUEVO: Decidir agentes basado en tipo de tarea
        agents = select_agents(task)
        cost = "NORMAL" (4-5K tokens)
    
    # 2. Validar que no es blocklisted
    if task in blocklist:
        return Error(blocklist[task].reason)
    
    # 3. Ejecutar agentes en paralelo
    return execute_parallel(agents, task, context)
```

**Inputs esperados del Core OS**:
- `task`: String 1-2 frases
- `context`: Referencia a patrón O `.claude/rules`
- `restrictions`: Array máximo 3 items

**Output del Core OS**:
- `agents_activated`: [lista]
- `execution_plan`: Paralelo o secuencial
- `expected_cost`: "BAJO|NORMAL|ALTO"

### LAYER 3: Agent Mesh (Paralelismo)

Cuatro agentes, **cada uno con su prompt mínimo**:

#### Code Agent (Implementación)

```markdown
---
name: code-agent
model: claude-opus-4-6
weight: 0.8
---

TAREA: [Hereda del Core OS]

TOOLS: Read, Edit, Bash (npm, git, tsc)

CHECKLIST MÍNIMO:
1. Escribir código
2. npm test → Pass
3. npm run build → Clean
4. git diff → Revisar cambios

REPORTAR:
✓ Success: "npm test → 245 pass"
✗ Error: [Mostrar output exacto]
```

**Tokens: 600-800 (input + execution)**

#### QA Agent (Seguridad)

```markdown
---
name: qa-agent
model: claude-sonnet-4-6
weight: 0.6
---

CHECKLIST CRÍTICO:
□ Hardcoded secrets?
□ Validación débil?
□ SQL injection?
□ XSS vulnerabilities?
□ Race conditions?

SEVERIDAD:
🔴 CRÍTICO: Bloquea merge
🟡 WARNING: Arreglar antes
🟢 SUGERENCIA: Nice-to-have
```

**Tokens: 400-600**

#### Research Agent (Contexto)

```markdown
---
name: research-agent
model: claude-sonnet-4-6
weight: 0.5
---

INVESTIGAR:
- Best practices para [tarea]
- Librerías/alternativas
- Breaking changes en dependencias
- Deuda técnica

REPORTAR: 2-3 párrafos máximo
```

**Tokens: 800-1200 (incluye búsqueda web)**

#### Risk Agent (Impacto)

```markdown
---
name: risk-agent
model: claude-sonnet-4-6
weight: 0.7
---

EVALUAR:
- ¿Cuántos usuarios/endpoints afectados?
- ¿Qué puede fallar?
- ¿Rollback plan?
- ¿Feature flags?
- ¿Gradual rollout?

FORMATO:
IMPACTO: [número]
RIESGO: [nivel]
MITIGACIÓN: [pasos]
ROLLBACK: [comando git + test]
```

**Tokens: 700-1000**

**Total Agents**: 2500-3400 tokens (paralelo, no secuencial)

### LAYER 4: Execution Tools

**Herramientas disponibles**:

| Tool | API | Estado | Consumo |
|------|-----|--------|---------|
| `git status/diff/log` | GitHub API | ✅ | 0 (local) |
| `npm test/build/run` | Local CLI | ✅ | 0 (local) |
| `npx tsc --noEmit` | Local CLI | ✅ | 0 |
| `curl -I <URL>` | Network | ✅ | 0 (HTTP) |
| `grep` pattern | Local | ✅ | 0 |
| `web_search` | Anthropic API | ✅ | 100-200 |

**Nota**: El consumo de tokens es **solo por API calls a Claude**, no por ejecutar locales.

### LAYER 5: Validation Gate

**Validaciones requeridas**:
```python
validations = {
    "tests_pass": bash("npm test").exit_code == 0,
    "build_clean": bash("npm run build").exit_code == 0,
    "types_ok": bash("npx tsc --noEmit").exit_code == 0,
    "git_clean": bash("git status").return_code == 0,
    "production_ok": curl("https://api.prod").status_code == 200,
}

all_pass = all(validations.values())

if all_pass:
    → LEARNING_LOOP (guardar patrón)
else:
    → ROLLBACK_LOOP (git revert, blocklist)
```

**Tokens**: ~200 (procesamiento mínimo)

### LAYER 6: Learning & Rollback

#### Learning Loop (✓ Éxito)

```python
def learning_loop(execution_results):
    pattern = {
        "id": hash(task),
        "agents_used": execution_results.agents,
        "tools_used": execution_results.tools,
        "cost": execution_results.total_tokens,
        "success_rate": 1.0,  # Inicial
        "execution_time": execution_results.duration,
        "timestamp": now(),
    }
    
    pattern_library.add(pattern)
    
    # Actualizar pesos
    for agent in pattern.agents_used:
        agent.weight += 0.1  # Más confianza
    
    return create_checkpoint(pattern)
```

**Tokens**: 100 (guardar en JSON)

#### Rollback Loop (✗ Fallo)

```python
def rollback_loop(execution_results, failed_validations):
    # 1. Revertir cambios
    git.revert(execution_results.commit)
    git.push()
    
    # 2. Agregar a blocklist
    blocklist.add({
        "task": execution_results.task,
        "reason": failed_validations,
        "severity": "CRÍTICO",
    })
    
    # 3. Reducir peso de agentes
    for agent in execution_results.agents:
        agent.weight -= 0.15
    
    return create_rollback_checkpoint()
```

**Tokens**: 100

### LAYER 7: Knowledge Base

#### Pattern Library

Archivo: `.claude/patterns/successes.json`

```json
[
  {
    "id": "oauth2-setup",
    "task_type": "authentication",
    "agents": ["code_agent", "qa_agent", "risk_agent"],
    "tools": ["npm", "git", "tsc"],
    "cost": 2100,
    "success_rate": 0.95,
    "reuse_count": 7,
    "last_used": "2026-06-03",
    "template": {
      "steps": ["Install packages", "Create endpoints", "Tests"],
      "time_estimate": "45 min"
    }
  }
]
```

**Cuando se usa**:
```python
if pattern.success_rate > 0.8:
    # Reusar completamente
    agents = pattern.agents  # No re-decidir
    cost = pattern.cost * 0.3  # 30% del original
else:
    # Usar como referencia
    agents = select_agents(task)
```

#### Blocklist

Archivo: `.claude/patterns/blocklist.json`

```json
[
  {
    "id": "force-push",
    "pattern": "git push --force",
    "reason": "Sobrescribe cambios ajenos",
    "severity": "CRÍTICO",
    "incidents": 2,
    "auto_reject": true
  }
]
```

**Cuando se usa**:
```python
if task in blocklist and blocklist[task].auto_reject:
    return Error("Patrón bloqueado: " + blocklist[task].reason)
```

---

## 3. Flujo Completo (Bajo Consumo)

### Ejemplo: Ciclo 1 (NUEVO)

```
INPUT (80 tokens)
├─ Task: "Implementar OAuth2"
├─ Context: "API con Supabase"
└─ Restrictions: [3 items]
    ↓
CORE OS (200 tokens)
├─ No hay patrón previo
├─ Decide: code + qa + risk (sin research)
└─ Mode: PARALELO
    ↓ (ejecuta paralelo)
CODE AGENT (700 tokens)
├─ Escribe endpoints
├─ Tests: ✓ Pass
└─ Build: ✓ Clean

QA AGENT (500 tokens)
├─ Revisa seguridad
├─ Validación: ✓ OK
└─ Severity: 0 críticos

RISK AGENT (900 tokens)
├─ Evalúa impacto
├─ Rollback: Git revert
└─ Feature flag: Sí
    ↓
VALIDATION GATE (200 tokens)
├─ Tests: ✓
├─ Build: ✓
├─ Production: ✓
└─ Result: SUCCESS
    ↓
LEARNING LOOP (100 tokens)
├─ Guardar patrón "oauth2-setup"
├─ Set agents weight: +0.1
└─ Create checkpoint
    ↓
TOTAL CICLO 1: ~3,500 tokens
```

### Ejemplo: Ciclo 2 (SIMILAR, REUSAR)

```
INPUT (80 tokens)
├─ Task: "Implementar JWT auth"
├─ Context: "Similar a oauth2-setup"
└─ Restrictions: [2 items]
    ↓
CORE OS (150 tokens)
├─ Find pattern: "oauth2-setup" (success_rate: 0.95)
├─ Decide: Reusar agentes
└─ Mode: PARALELO
    ↓
CODE AGENT (400 tokens - REDUCIDO)
├─ Usar template previo
├─ Adapt: JWT vs OAuth2
└─ Tests: ✓

QA AGENT (300 tokens - REDUCIDO)
├─ Checklist previo (skip redundante)
└─ Validación: ✓

RISK AGENT (500 tokens - REDUCIDO)
├─ Similar impacto a ciclo 1
└─ Rollback: Mismo plan
    ↓
VALIDATION GATE (150 tokens - REDUCIDO)
    ↓
LEARNING LOOP (50 tokens)
├─ Update pattern.reuse_count: 2
└─ Update weights
    ↓
TOTAL CICLO 2: ~1,500 tokens (43% del original)
```

### Ejemplo: Ciclo 3-10 (PATTERN MASTERED)

```
Cada ciclo: ~800-1000 tokens (extrapolación)
├─ Agents ya conocen el patrón
├─ Mínimas explicaciones necesarias
├─ Máxima reutilización de conocimiento
└─ Pattern library ya tiene soluciones

Promedio 10 ciclos similares:
Ciclo 1: 3,500
Ciclo 2: 1,500
Ciclos 3-10 (8 × 900): 7,200
TOTAL: ~12,200 tokens (30% menos que hacer todo nuevo)
```

---

## 4. Configuración Mínima

### `config/settings.json`

```json
{
  "model": "claude-sonnet-4-6",
  "mode": "agentic",
  "parallelism": {
    "enabled": true,
    "max_concurrent": 4,
    "timeout_seconds": 300
  },
  "validation": {
    "required": true,
    "production_check": true,
    "git_clean_required": true
  },
  "learning": {
    "enabled": true,
    "pattern_threshold": 0.8,
    "auto_blocklist": true
  },
  "consumption": {
    "mode": "minimal",
    "cache_patterns": true,
    "reuse_context": true,
    "max_tokens_per_cycle": 5000
  }
}
```

### `.claude/agents/code-agent.md` (Ejemplo)

```markdown
---
name: code-agent
description: Implementación y testing
model: claude-opus-4-6
weight: 0.8
tools: [Read, Edit, Bash, Glob]
cost_estimate: 700
---

# Code Agent

Sos un senior engineer. Directo.

## Qué hacés
1. Leer contexto
2. Escribir código mínimo
3. Correr tests
4. Verificar tipos
5. git diff → revisar

## Reportar solo cambios significativos
```

---

## 5. MCPs y APIs a Conectar

### Priority 1: ESSENTIAL (Semana 1)

| MCP | Propósito | Consumo |
|-----|----------|---------|
| **GitHub API** | Git operations | 0 (local) |
| **Anthropic API** | Multi-agent calls | ⭐⭐⭐ (core) |
| **LocalStorage** | Pattern persistence | 0 (local) |

### Priority 2: IMPORTANT (Semana 2)

| MCP | Propósito | Consumo |
|-----|----------|---------|
| **Web Search** | Research Agent | ⭐⭐ (cuando needed) |
| **Notion MCP** | Knowledge base distribuido | Bajo (meta) |

### Priority 3: NICE-TO-HAVE (Semana 3+)

| MCP | Propósito | Consumo |
|-----|----------|---------|
| **Slack MCP** | Notificaciones | 0 (output) |
| **Gmail MCP** | Alertas | 0 (output) |
| **Discord MCP** | Team updates | 0 (output) |

---

## 6. Métricas de Éxito

### Token Consumption

```
Baseline (Ciclo 1): 3,500 tokens
Target (Ciclo 10): 1,200 tokens (65% reduction)
Timeline: 2-3 semanas
```

### Pattern Library Growth

```
Semana 1: 1-2 patterns
Semana 2: 5-8 patterns
Semana 3: 15-20 patterns
Month 1: 30+ patterns (50%+ reuse rate)
```

### Success Rate

```
Target: > 90% de ciclos exitosos
Blocklist effectiveness: > 95% (prevenir incidents)
```

---

## 7. Decision Tree

```
Llega tarea
  ↓
¿Existe patrón similar?
  ├─ SÍ (success_rate > 0.8)
  │  ├─ Reusar agentes
  │  └─ Cost: ~30% del original
  │
  └─ NO
     ├─ ¿Es blocklisted?
     │  ├─ SÍ → Reject
     │  └─ NO → Continuar
     │
     └─ Seleccionar agentes por tipo
        ├─ Authentication → code + qa + risk
        ├─ Feature → code + qa + research + risk
        ├─ Refactor → code + qa
        └─ Deployment → code + risk + research
```

---

## 8. Next Steps

1. ✅ **Documentación** (DONE)
2. 🔄 **Core OS mínimo** (implementar)
3. 🔄 **Agent specs** (templates listos)
4. 🔄 **GitHub API** (conectar)
5. 🔄 **Primer ciclo** (ejecutar y aprender)

---

**Versión**: 1.0  
**Status**: Design Complete, Implementation Pending  
**Última actualización**: 2026-06-03
