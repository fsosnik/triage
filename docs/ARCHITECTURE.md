# TRIAGE OS — Architecture Document

## System Philosophy

**Core Principle**: Evidence > Prediction

Truth from production validates all decisions. No hallucinations. No assumptions.

## Decision Flow
INPUT: Task + Context + Constraints
↓
CLASSIFY: Detect task type (feature/bugfix/refactor/general)
↓
DETECT: Find similar pattern in history (> 80% success)
↓
SELECT: Choose agents based on task type + agent weights
↓
EXECUTE: Run 4 agents in PARALLEL with real tools
├─ Code Agent (implementation)
├─ QA Agent (security/bugs)
├─ Research Agent (best practices)
└─ Risk Agent (impact/rollback)
↓
VALIDATE: Test against REALITY
├─ npm test pass?
├─ npm build clean?
├─ curl production 200?
└─ blocklist clean?
↓
DECISION:
├─ ✅ PASS → LEARNING LOOP (weights +0.15)
└─ ❌ FAIL → ROLLBACK LOOP (weights -0.15, blocklist)
↓
LEARN: Update weights, capture patterns
↓
CHECKPOINT: Save state for reproducibility
↓
OUTPUT: Result + Metrics + Checkpoint

## Data Flow

### Input

```javascript
{
  task: string,              // Clear description
  context: string,           // Framework, language, env
  constraints: string[]      // Requirements
}
```

### Processing
Input → Classification → Pattern Detection → Agent Selection
↓
Parallel Execution (4 agents, real tools)
↓
Results Aggregation (1612 tokens, 3 successes)
↓
Validation Gate (truth check)
↓
Learning (weight updates, pattern capture)

### Output

```javascript
{
  status: 'SUCCESS',
  results: { agents: [...], totalTokens: 1612 },
  validation: { passed: true, checks: {...} },
  checkpoint: {...},
  metrics: { duration_ms: 2500, agents_used: [...] }
}
```

## State Management

### Patterns (Successes)

Located: `.claude/patterns/successes.json`

```json
[
  {
    "id": "pattern-1780526888155",
    "task_type": "feature",
    "agents": ["code", "qa", "research", "risk"],
    "success_rate": 1.0,
    "reuse_count": 5,
    "last_used": "2026-06-05T14:00:00Z"
  }
]
```

**Why**: Reuse proven solutions

### Blocklist (Failures)

Located: `.claude/patterns/blocklist.json`

```json
[
  {
    "id": "force-push",
    "severity": "CRÍTICO",
    "pattern": "git push --force",
    "incidents": 3,
    "blocked": true
  }
]
```

**Why**: Prevent known failures

### Checkpoints

Located: `.claude/checkpoints/`

```json
{
  "timestamp": "2026-06-05T14:00:00Z",
  "task": "Implement feature",
  "status": "VALIDATED",
  "agents_executed": ["code", "qa", "research", "risk"],
  "validations": {
    "agents_executed": true,
    "no_errors": true,
    "blocklist_clean": true
  }
}
```

**Why**: Reproducibility + audit trail

## Weight Model

### Agent Weights

Initial: `{ code: 0.7, qa: 0.6, research: 0.5, risk: 0.8 }`

**Update Rule**:
- Success: `weight += 0.15` (clamped to [0, 1])
- Failure: `weight -= 0.15` (clamped to [0, 1])

**Effect**: Higher weight → more likely to be selected

### Selection Algorithm

```python
def selectAgents(task_type, weights):
  base_agents = {
    'feature': ['code', 'qa', 'research', 'risk'],
    'bugfix': ['code', 'qa'],
    'refactor': ['code', 'qa'],
    'general': ['code', 'qa']
  }
  
  candidates = base_agents[task_type]
  selected = [a for a in candidates if weights[a] > 0.4]
  
  return sorted(selected, key=lambda a: weights[a], reverse=True)
```

## Tool Layer

Real execution only:

| Tool | Use | Validation |
|------|-----|-----------|
| npm test | Run tests | Exit code 0 |
| npm build | Compile | Exit code 0 |
| npx tsc | Type check | Exit code 0 |
| git | Version control | CLI output |
| curl | HTTP validation | Status 200 |
| grep | Pattern search | Match found |

**Rule**: If tool doesn't return success, task fails

## Knowledge Graph (Graphify)

### Structure

- **840 nodes**: Concepts, patterns, techniques
- **1102 edges**: Relationships
- **73 communities**: Semantic groups

### Usage

Before executing, select 10-20 relevant nodes from graph:

```javascript
const cache = new GraphifyTokenCache();
const relevant = cache.selectNodes(task, maxNodes=20);
const context = cache.compressContext(relevant);
// Reduces context from full KB to essential knowledge
```

## Multi-Tenancy

Each tenant isolated:

```javascript
const mt = new MultiTenant();
mt.createTenant({ name: 'Org A' });
mt.addPatternToTenant('tenant_a', pattern);
mt.getTenantPatterns('tenant_a'); // Only tenant_a patterns
```

## Distribution

Load balancer across multiple servers:

```javascript
const lb = new LoadBalancer();
lb.registerWorker('w1', capacity=10);
lb.registerWorker('w2', capacity=10);

const result = await lb.assignTask(task, 'feature');
// Assigns to least-loaded worker
```

## Monitoring

Health check endpoint:

```bash
curl http://localhost:3000/health
{
  "status": "UP",
  "metrics": {
    "cycles": 47,
    "success_rate": "91.5%",
    "patterns": 28
  }
}
```

Metrics collected:
- Total cycles executed
- Success rate
- Patterns learned
- Agent weights
- Token usage
- Execution times

## Security

1. **Blocklist enforcement**: CRÍTICO patterns rejected before execution
2. **Validation gate**: Results validated against reality
3. **Rollback on failure**: Failed executions reverted automatically
4. **No secrets in code**: Credentials only in .env
5. **Rate limiting**: 10 requests/sec default

## Future Enhancements

- [ ] Distributed agent execution
- [ ] Advanced MCPs (Notion, Asana, Linear)
- [ ] Machine learning for weight prediction
- [ ] Partial rollback (granular changes)
- [ ] Custom validators per tenant
- [ ] Real-time monitoring dashboard
