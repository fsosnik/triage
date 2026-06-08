# Phase 1: Learning & Feedback Loop

## Objetivo
Capturar patrones de éxito, almacenarlos, y usarlos en tareas futuras.

## Entrada
task: "Implementar OAuth2"
agents: ['code', 'qa', 'risk']
result: {
success: true,
duration: 45m,
tests_passed: 245
}

## Salida
1. Pattern guardado en `.claude/patterns/successes.json`
2. Agent weights actualizados
3. Nuevo skill registrado (si es reutilizable)
4. Checkpoint automático

## Estructura
- LearningLoop (orchestrador)
- PatternExtractor (qué aprender)
- PatternStorage (guardar)
- MetricsCollector (medir)

## Tests
- Capturar patrón simple
- Actualizar weights
- Usar patrón anterior
- Detectar reutilizable
