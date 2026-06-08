# TRIAGE OS — API Reference

## TriageOS (Classifier)

```javascript
const os = new TriageOS();

os.classifyTaskType('implement oauth2')
→ 'feature'

os.selectAgents('refactor')
→ ['code', 'qa']

os.getMetrics()
→ { tasksProcessed: 0, successRate: 0.92 }
```

## TriageOSCore (Orchestrator)

```javascript
const core = new TriageOSCore();

await core.executeCycle(
  'oauth2',
  ['code', 'qa', 'risk'],
  { success: true, tests_passed: 245 }
)
→ { validation, feedback, checkpoint }
```

## LearningLoop

```javascript
const loop = new LearningLoop();

await loop.processResult(
  'feature',
  ['code', 'qa'],
  { success: true, duration: 50, tokens_used: 1500 }
)
→ pattern or null

loop.getMetrics()
→ { total_metrics, avg_tokens, success_rate }
```

## ValidationGate

```javascript
const gate = new ValidationGate();

gate.validate({ success: true, tests_passed: 100 })
→ { reality, comparison, gate_passes }
```

## PatternStorage

```javascript
PatternStorage.save(pattern)
PatternStorage.load()
PatternStorage.findSimilar('authentication')
```

## AutoCheckpoint

```javascript
AutoCheckpoint.save({
  task: 'oauth2',
  status: 'VALIDATED'
})
→ 'checkpoint-...'

AutoCheckpoint.list()
```

## RollbackLoop

```javascript
const rollback = new RollbackLoop();

await rollback.handleFailure(task, agents, details)
→ failureRecord

rollback.getStats()
```

## ComparisonEngine

```javascript
ComparisonEngine.compare(prediction, reality)
→ { matches, mismatches, verdict }
```

## FeedbackEngine

```javascript
const feedback = new FeedbackEngine();

await feedback.process(taskType, agents, prediction, reality)
→ pattern or failureRecord
```
