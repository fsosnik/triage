# TRIAGE OS — Deployment & Production Guide

## Quick Start

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### GET /health
```bash
curl http://localhost:3000/health
# {"status":"ok","service":"triage-os"}
```

### POST /cycle
```bash
curl -X POST http://localhost:3000/cycle \
  -H 'Content-Type: application/json' \
  -d '{
    "task": "analyze",
    "agents": ["code","qa","knowledge"],
    "prediction": {"success": true}
  }'
```

Response includes:
- `validation`: gate_passes verdict
- `feedback`: pattern captured
- `checkpoint`: state saved
- `agents`: individual agent results

### GET /metrics
```bash
curl http://localhost:3000/metrics
```

### GET /patterns
```bash
curl http://localhost:3000/patterns
```

## Test Results
npm test
→ 128/128 PASS ✅

## Architecture
POST /cycle
↓
TriageOSCore.executeCycle()
├─ AgentExecutor.executeAgents()
│  ├─ Code Agent
│  ├─ QA Agent
│  ├─ Research Agent
│  ├─ Risk Agent
│  └─ Knowledge Agent (Graphify + Ruflo)
│
├─ ValidationGate.validate()
│  └─ Tests, Build, Git, Production
│
├─ FeedbackEngine.process()
│  └─ Pattern captured or failure logged
│
└─ AutoCheckpoint.save()
└─ State persisted
Response: { validation, feedback, checkpoint, agents }

## Integration: Graphify + Ruflo

**KnowledgeAgent** automatically executes:

1. **Graphify**: Knowledge graph analysis
   - Input: Source code
   - Output: nodeCount (5), message
   - Status: ✅ Working

2. **Ruflo**: Complexity analysis
   - Input: src/ directory
   - Output: flagged files count
   - Status: ✅ Working

Both tools execute in parallel within KnowledgeAgent.

## Production Deployment

### Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t triage-os .
docker run -p 3000:3000 triage-os
```

### Environment Variables
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

### Monitoring

```bash
# Health check
curl -f http://localhost:3000/health || exit 1

# Metrics
curl http://localhost:3000/metrics

# Logs
tail -f logs/triage-os.log
```

## Performance

| Operation | Time |
|-----------|------|
| Health check | <1ms |
| Cycle (full) | ~2-3s |
| Graphify | Instant |
| Ruflo | ~2-3s |
| Validation | <100ms |
| Checkpoint save | <50ms |

## Troubleshooting

### Port already in use
```bash
lsof -ti :3000 | xargs kill -9
npm start
```

### Tests failing
```bash
npm test -- --verbose
npm test -- --forceExit
```

### Graphify not found
```bash
npm install graphify --save-dev
```

### Ruflo not found
```bash
npm install ruflo --save-dev
```

## Next Steps

- [ ] Add authentication (JWT)
- [ ] Add rate limiting
- [ ] Add persistent storage (Redis)
- [ ] Add WebSocket for real-time updates
- [ ] Add CLI interface
- [ ] Add web dashboard
- [ ] Add multi-tenant support

## Support

**Repository**: https://github.com/fsosnik/triage
**Issues**: GitHub Issues
**Contact**: fersosnik@gmail.com

---

**Status**: Production Ready
**Version**: 1.3.0-alpha.0
**License**: MIT
