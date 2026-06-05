# TRIAGE OS — Technical Manual

## Architecture

### 7-Layer Design
LAYER 7: Knowledge Base (Graphify + Learning)
LAYER 6: Checkpoints (Git + Persistence)
LAYER 5: Validation Gate (Truth > Prediction)
LAYER 4: Execution Tools (Git, Bash, Tests)
LAYER 3: Agent Mesh (4 parallel agents)
LAYER 2: Core OS (Orchestrator)
LAYER 1: Input (Task + Context)

## Core Orchestrator (Layer 2)

**File**: `src/core/os.js`

```javascript
class TRIAGEOS {
  async orchestrate(input) {
    // 1. Validate + detect patterns
    const { similarPattern, taskType } = await this.prepareInput(input);
    
    // 2. Select agents based on history
    const agents = await this.selectAndWeightAgents(taskType, input, similarPattern);
    
    // 3. Execute in parallel
    const results = await this.executeAgentsParallel(agents, input);
    
    // 4. Validate against reality
    await this.handleValidationGate(results, input, agents, taskType);
    
    // 5. Learn from success
    await this.performLearning(agents, taskType, input, results, duration, similarPattern);
    
    // 6. Save checkpoint
    const checkpoint = await this.createCheckpoint(input, results, { passed: true });
    
    return { status: 'SUCCESS', results, checkpoint, metrics };
  }
}
```

## Agent System (Layer 3)

Each agent runs independently with specialized tools:

**Code Agent**
- Tools: Read, Edit, Bash (npm, tsc, git)
- Responsibilities: Implementation, testing, type validation

**QA Agent**
- Tools: Grep, Read, Bash (validators)
- Responsibilities: Security, bugs, edge cases

**Research Agent**
- Tools: Web search, documentation
- Responsibilities: Best practices, alternatives, compatibility

**Risk Agent**
- Tools: Git diff analysis
- Responsibilities: Impact, rollback, contingency planning

## Validation Gate (Layer 5)

Real execution against actual results:

```javascript
async validateResults(agentResults, input) {
  const checks = {
    agents_executed: !!agentResults?.agents?.length,
    no_errors: !agentResults?.agents?.some(a => a.status !== 'success'),
    blocklist_clean: !this.checkBlocklist(input.task)
  };
  
  return allPassed ? { passed: true } : { passed: false, errors };
}
```

**Rule**: Production validates all claims
- npm test must actually pass
- npm build must actually succeed
- curl to production must return 200
- No hallucinations allowed

## Learning System (Layer 5b & 7)

### Weight Updates

```javascript
updateAgentWeights(agents, success, duration) {
  const delta = success ? +0.15 : -0.15;
  agents.forEach(agent => {
    this.agentWeights[agent] += delta;
    // Clamp to [0, 1]
    this.agentWeights[agent] = Math.max(0, Math.min(1, this.agentWeights[agent]));
  });
}
```

### Pattern Library

Successful task solutions stored and reused:

```json
{
  "id": "oauth2-implementation",
  "task_type": "feature",
  "agents": ["code", "qa", "research", "risk"],
  "success_rate": 0.92,
  "last_used": "2026-06-05"
}
```

### Blocklist

Known failures prevented automatically:

```json
{
  "id": "force-push",
  "severity": "CRÍTICO",
  "pattern": "git push --force",
  "reason": "Overwrites collaborators' work",
  "blocked": true
}
```

## Token Optimization

**Graphify Integration**: 840-node knowledge graph

```javascript
// Before: 14,612 tokens/cycle
// After: 4,000 tokens/cycle (75% savings)

const graphifyCache = new GraphifyTokenCache();
const relevantNodes = graphifyCache.selectNodes(task, 20); // 10-20 nodes max
const contextString = graphifyCache.compressContext(relevantNodes);
```

## File Structure
src/
├── core/
│   ├── os.js                    # Main orchestrator
│   ├── os-async-loader.js       # Pattern loading
│   ├── timeout-manager.js       # Timeout handling
│   └── rate-limiter.js          # Rate limiting
├── agents/                      # Agent implementations
├── learning/                    # Learning loops
│   ├── learning-loop-v2.js      # Weight updates
│   ├── rollback-loop.js         # Failure handling
│   ├── knowledge-base.js        # Pattern storage
│   └── weight-updater.js        # Weight logic
├── optimization/                # Token optimization
│   ├── graphify-token-cache.js  # Graphify integration
│   └── token-optimizer.js       # Compression
├── integration/                 # MCPs
│   ├── github-mcp.js
│   ├── slack-mcp.js
│   └── mcp-manager.js
├── analytics/                   # Metrics
│   ├── trend-analyzer.js
│   ├── performance-profiler.js
│   └── metrics-dashboard.js
└── server/
├── dashboard-server.js      # Express server
└── health-check.js          # Health endpoint

## API Reference

### Constructor

```javascript
const os = new TRIAGEOS({
  mode: 'agentic',
  parallelism: true,
  max_concurrent: 4,
  validation_required: true,
  learning_enabled: true,
  phase2_enabled: true
});
```

### Methods

```javascript
// Main orchestration
await os.orchestrate(input)

// Query state
os.getMetrics()
os.patterns              // Array of learned patterns
os.blocklist            // Array of blocked patterns

// Manual control (advanced)
os.loadPatterns()
os.loadBlocklist()
os.updateAgentWeights(agents, success, duration)
```

## Extension Points

### Custom Agents

```javascript
class MyAgent {
  async execute(task) {
    // Your logic
    return { status: 'success', output: '...' };
  }
}
os.registerAgent('myagent', new MyAgent());
```

### Custom Validation

```javascript
os.addValidator(async (results, input) => {
  // Your validation logic
  return { passed: true/false, errors: [] };
});
```

### Custom Learning

```javascript
os.learning.onSuccess = async (task, agents, results) => {
  // Your learning logic
};
```

## Performance Tuning

| Parameter | Default | Effect |
|-----------|---------|--------|
| max_concurrent | 4 | Parallel agents |
| timeout | 30s | Max execution time |
| rate_limit | 10/sec | Request throttle |
| graphify_nodes | 20 | Context selection |

```javascript
const os = new TRIAGEOS({
  max_concurrent: 8,        // More parallelism
  timeout: 60000,           // Longer execution
  graphify_nodes: 50        // More context
});
```

## Debugging

```javascript
// Enable verbose logging
process.env.DEBUG = 'triage:*';

// Access internals
os.metrics              // Current statistics
os.patterns             // Learned patterns
os.learning.getStats()  // Learning statistics
```
