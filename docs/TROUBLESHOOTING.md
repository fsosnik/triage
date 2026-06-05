# TRIAGE OS — Troubleshooting Guide

## Common Issues

### 1. Task Fails Without Clear Error

**Symptom**: `status: FAILED` but no error message

**Solution**:
```javascript
const result = await os.orchestrate(task);
if (result.status === 'FAILED') {
  console.log('Validation errors:', result.validation.errors);
  console.log('Checkpoint:', result.checkpoint);
}
```

Check:
- Is task description clear?
- Add more context
- Loosen constraints

### 2. Low Success Rate

**Symptom**: Success rate < 70%

**Causes**: Vague tasks, unrealistic constraints

**Solution**:
```javascript
// Before (bad)
{ task: 'Fix stuff' }

// After (good)
{
  task: 'Fix memory leak in event listener',
  context: 'React 18, TypeScript',
  constraints: ['no performance regression', 'test coverage > 80%']
}
```

### 3. High Token Usage

**Symptom**: 10,000+ tokens per cycle

**Solution**: Enable Graphify optimization
```javascript
const os = new TRIAGEOS({
  phase2_enabled: true  // Uses learning cache
});

// Or manually
const { GraphifyTokenCache } = require('triage/src/optimization/graphify-token-cache');
const cache = new GraphifyTokenCache();
const compressed = cache.compress(context);
```

### 4. Agents Not Selected

**Symptom**: Only 1-2 agents running instead of 4

**Causes**: Low agent weights or task classification

**Solution**:
```javascript
// Check agent weights
console.log(os.learning.agentWeights);
// { code: 0.7, qa: 0.1, research: 0.3, risk: 0.8 }

// Reset if needed
os.learning.agentWeights.qa = 0.6;

// Check classification
const taskType = os.classifyTaskType('Your task');
console.log(taskType);  // 'feature', 'bugfix', 'refactor', 'general'
```

### 5. Validation Fails

**Symptom**: Validation gate rejects results

**Cause**: One of 3 checks failed:
- agents_executed: No agents ran
- no_errors: Agent returned error
- blocklist_clean: Task matches blocklist

**Solution**:
```javascript
const validation = await os.validateResults(agentResults, input);
console.log('Failed checks:', validation.errors);
// ['no_errors', 'blocklist_clean']

// Check blocklist
const blocked = os.blocklist.find(b => 
  new RegExp(b.pattern).test(input.task)
);
if (blocked) {
  console.log('Blocked:', blocked.reason);
  // Rephrase task to avoid pattern
}
```

### 6. Dashboard Not Responding

**Symptom**: `Cannot GET /`

**Solution**:
```bash
# Check if running
pm2 logs triage

# Restart
pm2 restart triage

# Or start manually
node src/server/dashboard-server.js

# Check health endpoint
curl http://localhost:3000/health
```

### 7. Patterns Not Learning

**Symptom**: `os.patterns.length` stays at 0

**Solution**:
```javascript
// Check if learning is enabled
console.log(os.config.learning_enabled);

// Manually trigger learning
os.learning.analyzeSuccess(
  'task',
  ['code', 'qa'],
  { agents: [...] },
  2500
);

// Save patterns
os.savePatterns();
```

### 8. Rate Limiter Blocking Requests

**Symptom**: 429 Too Many Requests

**Solution**:
```javascript
const os = new TRIAGEOS({
  rate_limiter: { max_per_second: 20 }  // Increase limit
});

// Or bypass for testing
process.env.RATE_LIMIT_DISABLED = true;
```

## Performance Issues

### Slow Execution

**Causes**: Sequential agents, network latency, heavy validation

**Solution**:
```javascript
// Ensure parallelism
const os = new TRIAGEOS({
  parallelism: true,
  max_concurrent: 4
});

// Reduce validation
const os = new TRIAGEOS({
  validation_required: false  // For testing only
});
```

### High Memory Usage

**Symptoms**: Process uses > 500MB

**Solution**:
```bash
# Monitor
pm2 monit triage

# Limit memory
pm2 start src/server/dashboard-server.js \
  --max-memory-restart 512M

# Clear old checkpoints
rm .claude/checkpoints/*.json  # Keep only recent
```

## Debug Mode

```bash
# Enable verbose logging
DEBUG=triage:* node server.js

# Or in code
process.env.DEBUG = 'triage:*,triage:learning:*';
```

## Logs

### PM2

```bash
pm2 logs triage              # Current logs
pm2 logs triage --lines 100  # Last 100 lines
pm2 logs triage --err        # Error logs only
```

### File-Based

```bash
# View all logs
tail -f ~/.pm2/logs/triage-out.log
tail -f ~/.pm2/logs/triage-err.log

# Search
grep "ERROR" ~/.pm2/logs/triage-err.log
```

## Reset & Recover

### Reset All State

```bash
# Clear patterns
rm .claude/patterns/successes.json
echo "[]" > .claude/patterns/successes.json

# Clear blocklist
rm .claude/patterns/blocklist.json
echo "[]" > .claude/patterns/blocklist.json

# Clear checkpoints
rm .claude/checkpoints/*.json

# Restart
pm2 restart triage
```

### Restore From Backup

```bash
tar -xzf triage-backup.tar.gz
pm2 restart triage
```

## Getting Help

1. Check logs: `pm2 logs triage`
2. Check health: `curl http://localhost:3000/health`
3. Check metrics: `curl http://localhost:3000/api/metrics`
4. Check issues on GitHub
5. Open issue with logs attached

## Performance Benchmarks

Expected on modern hardware:

| Metric | Expected |
|--------|----------|
| Task execution | 1-5 seconds |
| Agents parallel | 4 simultaneous |
| Token usage | 1,500-4,500/task |
| Success rate | 90%+ |
| Memory | 100-300MB |
| Throughput | 10 tasks/min |

If yours are worse, check:
- Network latency
- Disk I/O (checkpoints)
- Agent complexity
- Validation overhead
