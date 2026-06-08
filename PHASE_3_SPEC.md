# Phase 3: Feedback Loop Integration

## Concepto
Combinar Learning Loop + Validation Gate en un ciclo único.

## Flow

Task ejecutado
↓
LearningLoop.capture() → pattern
↓
ValidationGate.validate() → reality
↓
ComparisonEngine.compare() → verdict
↓
5a. Si VALID → learning_loop.store(pattern)
5b. Si INVALID → rollback_loop.handle(failure)
↓
checkpoint auto-guardado


## Estructura
- TriageOSCore (orquestador)
- FeedbackEngine (routing: success/failure)
- AutoCheckpoint (guardar estado)

## Tests
- Success path: capture + validate → pattern stored
- Failure path: validation fails → rollback triggered
- Mismatch path: prediction ≠ reality → reality wins
