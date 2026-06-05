# TRIAGE OS — 5-Minute Setup

## 1. Install (1 min)

```bash
# Via NPM
npm install triage-os

# Or clone + setup
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
```

## 2. Configure (1 min)

```bash
cp .env.example .env
# Edit .env with your API key
export ANTHROPIC_API_KEY=sk-...
```

## 3. Test (1 min)

```bash
npm test
# Should see: Tests: 225 passed, 9 failed (pre-existing)
```

## 4. Run (1 min)

```bash
npm start
# Open http://localhost:3000
```

## 5. Use (1 min)

```javascript
const TriageOS = require('triage-os');
const os = new TriageOS();

const result = await os.process({
  task: "Implement OAuth2",
  context: "Next.js + TypeScript"
});

console.log(result);
// ✅ VALIDATED — 4 agents executed, 40% tokens saved
```

## What Happens

1. **Input** → Task routed to Core OS
2. **Selection** → Graphify finds similar patterns
3. **Execution** → 4 agents run in parallel
4. **Validation** → Evidence-based gate checks
5. **Learning** → Pattern captured for next time
6. **Checkpoint** → Result logged

## Next Steps

- [Full Docs](README.md)
- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Graphify + Ruflo](docs/GRAPHIFY_RUFLO.md)
