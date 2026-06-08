# TRIAGE OS — API Server

## Start Server

```bash
npm start
# 🚀 TRIAGE OS API running on http://localhost:3000
```

## Endpoints

### POST /cycle
Execute a full TRIAGE OS cycle

**Request:**
```json
{
  "task": "oauth2-implementation",
  "agents": ["code", "qa", "risk"],
  "prediction": {
    "success": true,
    "tests_passed": 245
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "validation": { "reality": {...}, "comparison": {...}, "gate_passes": true },
    "feedback": { "pattern": {...} },
    "checkpoint": "checkpoint-2026-06-08T15-40.json"
  }
}
```

### GET /health
Health check

**Response:**
```json
{ "status": "ok", "service": "triage-os" }
```

### GET /metrics
System metrics

**Response:**
```json
{
  "total_metrics": 1,
  "avg_tokens": "1500",
  "success_rate": "100.0",
  "patterns_stored": 1
}
```

### GET /patterns
List learned patterns

**Response:**
```json
{
  "count": 1,
  "patterns": [
    {
      "id": "pattern-...",
      "name": "oauth2",
      "category": "authentication",
      "agents_used": ["code", "qa", "risk"],
      "success_rate": 100
    }
  ]
}
```

### GET /checkpoints
List saved checkpoints

**Response:**
```json
{
  "count": 3,
  "checkpoints": [
    "checkpoint-2026-06-08T15-40-00.json",
    ...
  ]
}
```

## Examples

### Using curl

```bash
# Execute cycle
curl -X POST http://localhost:3000/cycle \
  -H "Content-Type: application/json" \
  -d '{
    "task": "oauth2",
    "agents": ["code", "qa"],
    "prediction": {"success": true, "tests_passed": 100}
  }'

# Check health
curl http://localhost:3000/health

# Get metrics
curl http://localhost:3000/metrics

# List patterns
curl http://localhost:3000/patterns
```

### Using Node.js

```bash
node examples/client.js
```

## Environment

```bash
PORT=3000  # Default
```

## Status Codes

- `200`: Success
- `400`: Bad request (missing fields)
- `500`: Server error
