# TRIAGE OS

Agentic OS para optimizar decisiones de Claude mediante especialistas paralelos, validación contra realidad y aprendizaje continuo.

## Tecnología
- Node.js + Express
- 4 agents (Code, QA, Research, Risk)
- Graphify (840 nodes knowledge graph)
- Ruflo (complexity analysis)
- PM2 (production orchestration)

## Artefactos
- README.md (intro)
- docs/RELEASE_v1.0.md (release notes)
- src/core/os.js (orchestrator)
- src/server/dashboard-server.js (UI)
- graphify-out/ (knowledge visualization)

## Ejecución
Local: `npm run dev`
Fedora: http://100.72.120.32:3000
Health: `/health` endpoint

## Tests
107/115 pass. Fallas en Phase 4, 7, 11, 18 (state isolation).

## Token Optimization LAW
Graphify + Ruflo requerido. Selecciona 10-20 nodos relevantes de 840.

## Contribución
1. Fork + PR
2. npm test debe pasar
3. Documenta cambios
4. Updatea CHANGELOG
