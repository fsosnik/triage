# Data Schema — Archivos Generados Automáticamente

## 1. analytics/events.json
**Generado por**: `src/analytics/analytics-engine.js`
**Contenido**: Eventos de ciclos
**Política**: Rotación cada 30 días

## 2. knowledge/patterns.json
**Generado por**: `src/knowledge/knowledge-base.js`
**Contenido**: Patrones exitosos aprendidos
**Política**: Mantener indefinidamente, versionado en Git

## 3. knowledge/failures.json
**Contenido**: Fallos + razones (blocklist dinámico)
**Política**: Mantener, desactivar patterns después de N fallos

## 4. knowledge/insights.json
**Contenido**: Insights capturados manualmente
**Política**: Mantener, revisar cada fase

## 5. security/audit-log.json
**Generado por**: `src/security/audit-log.js`
**Contenido**: Quién hizo qué y cuándo
**Política**: Mantener indefinidamente, archivar anual
