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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
