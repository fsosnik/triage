# LOW_CONSUMPTION_GUIDE.md — Minimizar Tokens

> Cómo diseñar prompts, arquitectura y workflows para usar el **mínimo consumo posible**.

---

## 📊 Target de Consumo

```
Baseline (Sin optimizar):
  - Ciclo 1 (nuevo): 5,000-7,000 tokens
  - Ciclo 2-10 (similar): 5,000-7,000 tokens c/u
  - TOTAL 10 ciclos: ~55,000 tokens

Optimizado (Con este sistema):
  - Ciclo 1 (nuevo): 4,000 tokens (-30%)
  - Ciclo 2-10 (reutilizando): 800-1,200 tokens c/u (-80%)
  - TOTAL 10 ciclos: ~12,000 tokens (-78%)

= Ahorro de 43,000 tokens (equivalente a $1.50 en costos API)
```

---

## 1. Técnica: Prompts Estructurados

### ❌ LARGO (Malo)

```
Necesito que implemente un sistema de autenticación OAuth2 
en mi aplicación Next.js 14 con TypeScript. Debe integrar 
con Supabase como base de datos de usuarios. Necesito que 
hagas login, registro, logout, refresh tokens, y todo integrado 
con la API. También quiero que implementes tests unitarios y 
de integración para todo esto. Y documentación.
```

**Análisis**: 92 tokens de input (prompt gordo, repetitivo)

### ✅ CORTO (Bueno)

```
TAREA: Implementar OAuth2 con Supabase

CONTEXTO: Next.js 14 + TypeScript (ver CLAUDE.md)

REQUISITOS:
- Login/registro/logout
- Refresh tokens
- Tests unitarios

RESTRICCIONES:
- No breakear tests existentes
- Documentar en README
```

**Análisis**: 42 tokens de input (60% menos, igual información)

---

## 2. Técnica: Referencia a Patrón

### ❌ EXPANDIDO (Malo)

```
Implementar JWT authentication en Next.js.

Aquí está el contexto completo de nuestro OAuth2 implementation 
anterior (paste 3000 tokens del código previo)...

Ahora necesito que hagas algo similar pero con JWT...
```

**Costo**: 3,000+ tokens de contexto duplicado

### ✅ REFERENCIADO (Bueno)

```
TAREA: Implementar JWT auth

CONTEXTO: Patrón previo "oauth2-setup" en pattern_library
          (reusar estructura, cambiar OAuth2 → JWT)

CAMBIOS:
- Auth provider: Supabase JWT vs OAuth2
- Token format: JWT vs session cookies
```

**Costo**: 200 tokens (99% menos, mismo resultado)

---

## 3. Técnica: Paralelismo

### ❌ SECUENCIAL (Lento)

```python
# Cada agente espera al anterior
code_output = code_agent.process(task)  # 5 min, 700 tokens
qa_output = qa_agent.process(code_output)  # 3 min, 500 tokens
research_output = research_agent.process(qa_output)  # 2 min, 800 tokens
risk_output = risk_agent.process(research_output)  # 2 min, 900 tokens

TOTAL: 12 min, 2,900 tokens
```

### ✅ PARALELO (Rápido)

```python
# Los 4 agentes ejecutan simultáneamente
outputs = await Promise.all([
  code_agent.process(task),           # 5 min, 700 tokens
  qa_agent.process(task),              # 3 min, 500 tokens
  research_agent.process(task),        # 2 min, 800 tokens
  risk_agent.process(task),            # 2 min, 900 tokens
])

TOTAL: 5 min (2.4x más rápido), 2,900 tokens (MISMO!)
```

**Ahorro**: 7 minutos de latencia, mismo costo.

---

## 4. Técnica: Pattern Caching

### Nivel 0: Sin cache (primera vez)

```
CODE AGENT request:
  system: "Eres un senior engineer..." (300 tokens)
  context: "Implementar OAuth2" (200 tokens)
  pattern_library: [completa 500 tokens] 
  messages: Instrucciones (100 tokens)
  ─────────────────────────────
  TOTAL: ~1,200 tokens por agent
```

### Nivel 1: Pattern cache (segunda vez similar)

```
Detect: "jwt-auth similar a oauth2-setup"

CODE AGENT request:
  system: "Eres un senior engineer..." (300 tokens)
  context: "Patrón previo: oauth2-setup" (50 tokens)  ← Comprimido
  changes: "JWT vs OAuth2, cambios mínimos" (80 tokens)
  ─────────────────────────────
  TOTAL: ~430 tokens por agent (64% menos!)
```

**Con Anthropic cache_control**:

```javascript
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  system: [
    {
      type: "text",
      text: agent_system_prompt,
    },
    {
      type: "text",
      text: JSON.stringify(pattern_library),
      // Este bloque se cachea después del primer uso
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: task }],
});

// Primer request: 1,200 tokens
// Siguientes (24h): 100 tokens (~92% menos)
```

---

## 5. Técnica: Selección Inteligente de Agentes

### ❌ ACTIVAR SIEMPRE (Malo)

```
Tarea: Actualizar README

Activar: code + qa + research + risk (TODOS)
  ├─ Code: "Escribir párrafos" (no necesario)
  ├─ QA: "Revisar markdown" (no necesario)
  ├─ Research: "Best practices en READMEs" (sí, útil)
  └─ Risk: "Impacto de cambios en docs" (no necesario)

TOTAL: 3,400 tokens
DESPERDICIO: 2,200 tokens (65%)
```

### ✅ SELECCIONAR INTELIGENTE (Bueno)

```python
# decision_tree en Core OS
task_type = classify(task)  # "documentation"

agents_by_type = {
  "authentication": ["code", "qa", "research", "risk"],
  "feature": ["code", "qa", "research", "risk"],
  "bugfix": ["code", "qa"],
  "refactor": ["code", "qa"],
  "documentation": ["research"],  ← Solo este
  "deployment": ["code", "risk"],
  "security": ["code", "qa", "risk"],
}

selected = agents_by_type[task_type]
# Resultado: Solo Research Agent (800 tokens)
# Ahorro: 2,600 tokens
```

---

## 6. Técnica: Token Budget

### Implementar límite de consumo

```json
{
  "consumption": {
    "max_tokens_per_cycle": 5000,
    "max_tokens_per_agent": 1200,
    "max_total_per_month": 100000,
    "alert_at_80_percent": true
  }
}
```

### Monitoreo

```python
def validate_consumption(request, limit=5000):
    estimated = sum(
        agent.estimated_cost 
        for agent in request.agents
    )
    
    if estimated > limit:
        # Estrategias de reducción
        if "research" in request.agents:
            # Eliminar Research (muy costoso)
            request.agents.remove("research")
            estimated -= 800
        
        if estimated > limit:
            # Usar patrón cache
            request.use_cached_pattern = True
            estimated *= 0.3
    
    return request
```

---

## 7. Técnica: Compresión de Contexto

### ❌ CONTEXTO COMPLETO (Malo)

```markdown
# CONTEXTO COMPLETO

## Stack
- Next.js 14
- TypeScript 5.0
- Tailwind CSS
- Supabase
- Vercel
- ESLint + Prettier
- Jest + React Testing Library

## Project History
(pega 2000 líneas de commits previos)

## Previous implementations
(pega 5 ejemplos previos completos)

## Guidelines
(pega 10 archivos de guías)
```

**Costo**: 3,000+ tokens de contexto que se repite.

### ✅ REFERENCIA COMPRIMIDA (Bueno)

```markdown
# CONTEXTO (COMPRIMIDO)

Ver: CLAUDE.md + docs/architecture/AGENTS.md

Patrón previo: pattern_library["oauth2-setup"]
  └─ Success rate: 95%
  └─ Agents: [code, qa, risk]
  └─ Cost: 2,100 tokens

Cambios vs. patrón anterior: [lista mínima]
```

**Costo**: 150 tokens (95% menos, igual utilidad)

---

## 8. Técnica: Asincronía

### ❌ ESPERAR RESPUESTA (Malo)

```
Input tarea → Claude Agent 1 → Esperar → Claude Agent 2 → Esperar → ...
(Latencia: 12 min + consumo secuencial)
```

### ✅ FIRE AND FORGET (Bueno)

```python
# No esperar respuesta de cada agente
async def orchestrate_agents(task):
    # Mandar todos los requests simultáneamente
    code_request = client.messages.create(...)  # No esperar
    qa_request = client.messages.create(...)    # No esperar
    research_request = client.messages.create(...) # No esperar
    risk_request = client.messages.create(...)   # No esperar
    
    # Recolectar resultados en paralelo
    results = await Promise.all([
        code_request,
        qa_request,
        research_request,
        risk_request,
    ])
    
    return results
    # Latencia: 5 min (max de cualquiera)
    # Consumo: MISMO (pero paralelo)
```

---

## 9. Técnica: Compression Ratios por Agente

### Code Agent

```
Sistema tradicional:
  Input: 1,200 tokens (sistema + contexto + tarea)
  Output: ~800 tokens
  TOTAL: 2,000 tokens

Optimizado:
  Input: 400 tokens (sistema comprimido + referencia a patrón)
  Output: ~700 tokens (igual funcionalidad)
  TOTAL: 1,100 tokens (45% menos)

Método: Referencia a patrón + pattern caching
```

### QA Agent

```
Sistema tradicional:
  Input: 900 tokens
  Output: ~500 tokens
  TOTAL: 1,400 tokens

Optimizado:
  Input: 300 tokens (checklist mínimo del patrón)
  Output: ~400 tokens
  TOTAL: 700 tokens (50% menos)

Método: Checklist reutilizable por tipo de tarea
```

### Research Agent

```
Sistema tradicional:
  Input: 1,200 tokens (con contexto completo)
  Web search: 3-5 búsquedas (200-300 tokens c/u)
  TOTAL: 3,000+ tokens

Optimizado:
  Input: 400 tokens (solo si NUEVO)
  Web search: 1-2 búsquedas (100 tokens c/u)
  TOTAL: 600 tokens (si se reutiliza, skip completamente = 0)

Método: Solo activar si no hay patrón previo
```

### Risk Agent

```
Sistema tradicional:
  Input: 1,100 tokens
  Output: ~700 tokens
  TOTAL: 1,800 tokens

Optimizado:
  Input: 350 tokens (estructura estándar)
  Output: ~600 tokens (mismo contenido)
  TOTAL: 950 tokens (47% menos)

Método: Template reutilizable
```

---

## 10. Checklist de Implementación

### Antes de cada ciclo

- [ ] ¿Existe patrón similar?
  - SÍ → Usar cached pattern (ahorra 70%)
  - NO → Continuar

- [ ] ¿Es nueva investigación necesaria?
  - SÍ → Activar Research Agent
  - NO → Skip (ahorra 800 tokens)

- [ ] ¿Cuántos agentes necesito?
  - Usar decision tree (ahorra 30-40%)

- [ ] ¿Puedo paralelizar?
  - SÍ → Ejecutar paralelo (mismo costo, 5x más rápido)

- [ ] ¿Puedo comprimir contexto?
  - Reemplazar texto largo con referencias (ahorra 60-80%)

- [ ] ¿Tengo cache_control habilitado?
  - SÍ → Pattern library se cachea (ahorra 92% en subsecuentes)

---

## 11. Ejemplo: Comparativa de 3 Ciclos

### Ciclo 1: OAuth2 Setup (NUEVO)

```
Core OS: 200 tokens
Code Agent: 900 tokens
QA Agent: 600 tokens
Research Agent: 1,000 tokens (web search incluido)
Risk Agent: 900 tokens
Validation: 150 tokens
─────────────────────
TOTAL: 3,750 tokens

Learning Loop: +100 tokens
─────────────────────
CICLO 1 TOTAL: 3,850 tokens
```

### Ciclo 2: JWT Auth (SIMILAR a OAuth2)

```
Core OS: 150 tokens
  └─ Detecta patrón "oauth2-setup" (success_rate: 0.95)
  └─ Decide reutilizar agentes

Code Agent: 450 tokens (template previo + cambios)
QA Agent: 350 tokens (checklist previo)
Research Agent: 0 tokens (SKIP - patrón conocido)
Risk Agent: 500 tokens (estructura similar)
Validation: 100 tokens
─────────────────────
TOTAL: 1,550 tokens (60% menos!)

Learning Loop: +50 tokens
─────────────────────
CICLO 2 TOTAL: 1,600 tokens
```

### Ciclo 3: API Rate Limiting (SIMILAR a OAuth2)

```
Con cache_control activado:
  └─ Pattern library se cachea (92% descuento)

Core OS: 50 tokens (cached system)
Code Agent: 250 tokens (template cached + mínimos cambios)
QA Agent: 200 tokens (checklist cached)
Research Agent: 0 tokens (SKIP)
Risk Agent: 300 tokens
Validation: 80 tokens
─────────────────────
TOTAL: 880 tokens (77% menos que ciclo 1!)

Learning Loop: +30 tokens
─────────────────────
CICLO 3 TOTAL: 910 tokens
```

### Resumen 3 Ciclos

```
Sin optimizar:
  Ciclo 1: 3,850
  Ciclo 2: 3,850
  Ciclo 3: 3,850
  ─────────────
  TOTAL: 11,550 tokens

Con optimizaciones:
  Ciclo 1: 3,850 (baseline)
  Ciclo 2: 1,600 (-58%)
  Ciclo 3: 910 (-76%)
  ─────────────
  TOTAL: 6,360 tokens

AHORRO: 5,190 tokens (45% menos)
En dinero: $0.26 USD por 3 ciclos
```

---

## 12. Monitoreo en Tiempo Real

```bash
# Ver consumo actual
npm run monitor:consumption

# Output:
# ┌─────────────────────────────────────────┐
# │ Consumo Mensual: 45,230 / 100,000 tokens │
# │ Progreso: ████████░░░░░░░░░░░░ 45%     │
# │ Budget restante: 54,770 tokens         │
# │ Proyección: Completará mes OK           │
# └─────────────────────────────────────────┘
#
# Últimos ciclos:
# - oauth2-setup: 3,850 tokens (↑ baseline)
# - jwt-auth: 1,600 tokens (↓ -58%)
# - rate-limiting: 910 tokens (↓ -76%)
#
# Pattern cache hits: 12 / 15 (80%)
# Total ahorrado: 8,200 tokens
```

---

## 13. Automatizar Reducción

### Script de optimización

```python
# scripts/optimize-consumption.py

def analyze_cycle(cycle):
    recommendations = []
    
    if not cycle.has_pattern_reference:
        recommendations.append(
            "⚠️ Usa patrón existente (ahorraría 60%)"
        )
    
    if cycle.research_agent_used and \
       not cycle.is_research_necessary:
        recommendations.append(
            "⚠️ Research Agent innecesario (ahorraría 800 tokens)"
        )
    
    if not cycle.parallel_execution:
        recommendations.append(
            "⚠️ Ejecutar agentes en paralelo (5x más rápido)"
        )
    
    if not cycle.uses_cache_control:
        recommendations.append(
            "⚠️ Habilitar cache_control (ahorraría 92% siguientes ciclos)"
        )
    
    return recommendations

# Ejecutar después de cada ciclo
recomendations = analyze_cycle(last_cycle)
for rec in recommendations:
    print(rec)
```

---

## 14. Límites de Consumo

```json
{
  "limits": {
    "per_cycle": {
      "new_task": 4000,
      "similar_task": 1500,
      "cached_task": 900
    },
    "per_month": {
      "development": 100000,
      "production": 500000,
      "testing": 10000
    },
    "alerts": {
      "warn_at_80_percent": true,
      "block_at_100_percent": true,
      "slack_notification": true
    }
  }
}
```

---

## 15. ROI de Optimizaciones

```
Tiempo de implementación: 2 horas
Ahorro por mes: 40,000 tokens (~$2.00 USD)
ROI: Pagado en 1 mes

Por año: 480,000 tokens (~$24 USD)
Escalabilidad: A mayor uso, mayor ahorro (ley de compound returns)
```

---

**Versión**: 1.0  
**Target**: 78% consumo reduction en 10 ciclos  
**Status**: Ready to implement  
**Última actualización**: 2026-06-03
