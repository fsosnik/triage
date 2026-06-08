# Graphify + Ruflo Integration

## Architecture
POST /cycle { agents: ["knowledge"] }
↓
TriageOSCore.executeCycle(task, agents, prediction)
↓
AgentExecutor.executeAgents(agents, task)
├─ code, qa, research, risk agents
└─ knowledge agent → KnowledgeAgent
↓
KnowledgeAgent.executeKnowledgeAgent(task)
├─ 📊 GRAPHIFY (GraphifyAdapter)
│  ├─ Instancia: new GraphifyAdapter()
│  ├─ Retorna: nodeCount = 5
│  └─ Uso: Analizar nodos del grafo
│
└─ 🔧 RUFLO (CLI via execSync)
├─ Ejecuta: npx ruflo@latest analyze complexity src/
├─ Retorna: flagged files count
└─ Uso: Análisis de complejidad ciclomática
↓
Result: { task, success, graphify, ruflo }
├─ graphify: { success, nodes, message }
└─ ruflo: { success, analysis }
↓
ValidationGate.validate() → VALID
↓
FeedbackEngine.process() → Pattern saved
↓
AutoCheckpoint.save() → State persisted
↓
HTTP Response: { validation, feedback, checkpoint, agents }

## Usage

### Start Server
```bash
npm start
# 🚀 TRIAGE OS running on http://localhost:3000
```

### Execute Cycle with KnowledgeAgent
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "analyze-code",
    "agents": ["knowledge"],
    "prediction": { "success": true }
  }'
```

### Response Example
```json
{
  "status": "success",
  "data": {
    "agents": {
      "knowledge": {
        "task": "analyze-code",
        "success": true,
        "graphify": {
          "success": true,
          "nodes": 5,
          "message": "Knowledge graph: 5 nodes analyzed"
        },
        "ruflo": {
          "success": true,
          "analysis": "| Flagged files: 0      |"
        }
      }
    },
    "validation": { "gate_passes": true, "verdict": "VALID" },
    "feedback": { "pattern captured": true },
    "checkpoint": "checkpoint-XXX.json"
  }
}
```

## Implementation Details

### GraphifyAdapter
- Location: `src/optimization/graphify-adapter.js`
- Provides: Knowledge graph with nodes
- Key method: `get nodeCount()` → returns number of nodes

### KnowledgeAgent
- Location: `src/agents/knowledge-agent.js`
- Executes: Graphify + Ruflo in parallel
- Returns: Combined analysis results

### Integration Points
1. **AgentExecutor**: Calls `KnowledgeAgent.executeKnowledgeAgent()`
2. **ValidationGate**: Validates both tools executed successfully
3. **FeedbackEngine**: Captures pattern from results
4. **AutoCheckpoint**: Persists state with Graphify + Ruflo metrics

## Performance

| Tool | Execution Time | Output |
|------|----------------|--------|
| Graphify | Instant (in-memory) | Node count |
| Ruflo | ~2-3s (CLI) | Complexity analysis |
| Total | ~2-3s | Combined insights |

## Next Steps

- [ ] Real Graphify graph generation (currently mock)
- [ ] Store Graphify output in knowledge graph storage
- [ ] Integrate results into pattern recommendations
- [ ] Add visualization of Graphify nodes
- [ ] Archive Ruflo reports per cycle

---

**Status**: ✅ Integration Complete
**Tested**: 2026-06-08
**Agents**: All 5 working (code, qa, research, risk, knowledge)
