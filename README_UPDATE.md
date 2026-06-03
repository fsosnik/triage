# TRIAGE OS Architecture

![TRIAGE OS Architecture](docs/architecture-diagram.png)

## Sistema Operativo Agentico Autoaprendiz

TRIAGE OS es un sistema de orquestación de agentes especializados que valida evidencia, aprende de fallos y evoluciona automáticamente.

### Principio Rector
**La verdad del proyecto está en la evidencia, no en la predicción.**

- Producción real > Predicción
- Output ejecutado > Intención declarada
- Resultado medido > Suposición
- Git > Documentación

### Arquitectura de 7 Capas

**Core OS — Orquestador Central**
- Enruta tareas a agentes especializados
- Valida evidencia
- Aprende de fallos
- Evoluciona automáticamente

**4 Agentes Especializados (Paralelo)**
- **Code Agent**: Validación, tests, build
- **QA Agent**: Bugs, seguridad, edge cases
- **Research Agent**: Datos, contexto, best practices
- **Risk Agent**: Impacto, rollback, contingencia

**Execution Layer — Herramientas Reales**
- Git · Bash · Tests · Lint · Build · APIs · Validadores
- Cada ejecución emite evidencia verificable

**Validation Gate — Verdad del Proyecto**
- Producción real > Predicción
- Documentación > Suposición
- Evidencia > Intención
- Estado: VALID o ROLLBACK

**Learning Loop — Aprende de Éxito**
- Captura patrón
- Mejora decisión
- Conocimiento nuevo
- Evolución de agentes

**Checkpoint Automático**
- Git status · Commit hash
- Validaciones ejecutadas
- Producción verificada
- Riesgos declarados
- Próximo paso

**Knowledge Base Distribuida (Auto-evolución)**
- Pattern Library: Lo que funcionó + Por qué
- Blocklist Dinámico: Lo que falla + Nunca más

### Estados del Sistema

- **✓ VALID** (verde): Éxito → Learning Loop
- **✗ ROLLBACK** (rojo): Fallo → Revert + Blocklist
- **⚠ PARTIAL**: Algunas validaciones fallaron

### Agentes Paralelizados

Los 4 agentes ejecutan en paralelo:
- Code Agent: Implementación + Validación
- QA Agent: Seguridad + Bugs
- Research Agent: Contexto + Best practices
- Risk Agent: Impacto + Rollback plan

**Resultado**: Máxima calidad en tiempo mínimo

---

## Fases Implementadas (0-14)

| Fase | Componente | Status |
|------|-----------|--------|
| 0 | Setup | ✓ |
| 1 | Core OS | ✓ |
| 2 | Learning Loops | ✓ |
| 3 | Token Optimization | ✓ |
| 4 | Scale (Multi-tenant) | ✓ |
| 5 | Observability | ✓ |
| 6 | Deployment & CI/CD | ✓ |
| 7 | Auto-Tuning | ✓ |
| 8 | Integrations | ✓ |
| 9 | Analytics | ✓ |
| 10 | Security | ✓ |
| 11 | Knowledge Management | ✓ |
| 12 | REST API Server | ✓ |
| 13 | CLI Tools | ✓ |
| 14 | Performance Benchmarking | ✓ |

---
