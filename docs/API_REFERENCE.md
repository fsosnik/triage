# API Reference

## Endpoints

### GET /api/metrics
Compressed events (59% reduction)
```json
{
  "data": [
    { "t": "c", "ts": 1717509900, "s": 1, "tk": 1500, "d": 100 }
  ],
  "compression": "59%"
}
```

### GET /api/patterns
Compressed patterns
```json
{
  "data": [
    { "id": "p1", "sr": 95, "a": "code,qa", "t": 100 }
  ]
}
```

### GET /api/agents
Agent weights
```json
{ "code": 0.95, "qa": 0.45, "research": 0.50, "risk": 0.70 }
```

### WS ws://localhost:3000
Live event stream (every 2s)
