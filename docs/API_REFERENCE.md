# TRIAGE OS — API Reference

## Constructor

```javascript
const os = new TriageOS({
  model: 'claude-sonnet-4-6',
  learningEnabled: true,
  timeout: 300000,
  tokenLimit: 4000
});
```

## orchestrate(task)

```javascript
const result = await os.orchestrate({
  task: 'String describing what to do',
  context: 'Object or string with context',
  constraints: ['Array of constraints'],
  agents: ['code_agent', 'qa_agent'],
  timeout: 300000
});

// Returns: { status, agents, validations, output, checkpoint, warnings, errors, metrics, learnings }
```

## getMetrics()

```javascript
const metrics = os.getMetrics();
// { success_rate, patterns, blocklist, agent_weights, checkpoints }
```

## getPatterns()

View learned success patterns.

## getBlocklist()

View known-failure patterns.

## checkpoint(options)

```javascript
await os.checkpoint({
  name: 'auth-complete',
  description: 'OAuth2 done'
});
```

## Error Handling

```javascript
try {
  const result = await os.orchestrate({...});
  if (result.status === 'FAILED') {
    console.error('Reason:', result.errors);
  }
} catch (err) {
  console.error('System error:', err.message);
}
```
