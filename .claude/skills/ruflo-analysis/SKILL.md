---
name: ruflo-analysis
description: Analyze code complexity, refactor recommendations, extract symbols
triggers:
  - "analyze"
  - "complexity"
  - "refactor"
user-invocable: true
---

# Ruflo Analysis

Use Ruflo para analizar complejidad del código.

## Comandos

```bash
# Analizar archivo específico
npx ruflo analyze ast src/core/os.js --complexity

# Ver hotspots
npx ruflo analyze complexity src/ --threshold 10

# Extraer símbolos
npx ruflo analyze symbols src/core/os.js

# Circular deps
npx ruflo analyze circular src/
```

## Output
- Cyclomatic complexity
- Cognitive complexity
- LOC
- Functions, classes
- Refactor recommendations
