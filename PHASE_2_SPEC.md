# Phase 2: Validation Gate

## Función
Comparar resultado REAL vs predicción.
Si contradicen: REAL siempre gana.

## Validaciones
1. npm test   → exit code 0/1
2. npm build  → exit code 0/1
3. git status → clean/dirty
4. curl -I    → 200 OK (production alive)
5. tsc check  → 0/N errors

## Entrada
prediction: { success: true, tests_passed: 245 }
reality:    { tests: "18 passed, 5 failed" }

## Salida
status: MISMATCH
reality: { tests_passed: 18, tests_failed: 5 }
override: reality > prediction
action: ROLLBACK or INVESTIGATE

## Estructura
- ValidationGate (orquestador)
- TestValidator (npm test)
- BuildValidator (npm build)
- GitValidator (git status/diff)
- ProductionValidator (curl)
- ComparisonEngine (real vs prediction)

## Tests
- Detect test failure
- Detect build failure
- Detect dirty git
- Detect production down
- Prefer reality over prediction
