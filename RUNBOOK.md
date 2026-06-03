# TRIAGE OS Production Runbook

## Quick Start

```bash
# Clone
git clone https://github.com/fsosnik/triage.git
cd triage

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API keys

# Validate
npm run validate:structure

# Start
npm run start
```

## Deployment

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:prod
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Common Tasks

### Run orchestration
```bash
npm run orchestrate "your task here"
# Or via API:
curl -X POST http://localhost:3000/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"task":"your task"}'
```

### Monitor system
```bash
npm run monitor:consumption
# Or via API:
curl http://localhost:3000/metrics
```

### View patterns
```bash
npm run cli patterns 20
# Or via API:
curl http://localhost:3000/patterns
```

### Check knowledge base
```bash
node -e "const KB = require('./src/knowledge/knowledge-base'); const kb = new KB(); console.log(kb.getStats());"
```

## Troubleshooting

### Deployment failed
1. Check preflight: `npm run validate:structure`
2. Check logs: `.claude/checkpoints/latest.json`
3. Rollback: `npm run rollback:last`

### High token consumption
1. Check cache hits: `npm run monitor:consumption`
2. Review patterns: `npm run cli patterns`
3. Optimize: `npm run optimize:patterns`

### Memory issues
1. Clear checkpoints: `rm -rf .claude/checkpoints/*`
2. Restart: `npm run restart`
3. Monitor: `npm run monitor:memory`

## Monitoring

### Key metrics
- Success rate: `.claude/patterns/successes.json`
- Failures: `.claude/patterns/blocklist.json`
- Performance: `.claude/analytics/*`
- Health: `curl /health`

### Alerts
- Failure rate > 20% → investigate
- Token consumption anomaly → check patterns
- API latency > 5s → profile

## Backup & Recovery

### Backup
```bash
npm run backup:full
```

### Restore
```bash
npm run restore [backup-id]
```

## Updates

```bash
git pull origin main
npm install
npm run migrate
npm run test
npm run deploy:prod
```

## Support

- GitHub: https://github.com/fsosnik/triage
- Issues: Check .claude/patterns/blocklist.json
- Metrics: Check .claude/analytics/
- Logs: Check .claude/checkpoints/

---

**Version**: 0.16.0  
**Status**: Production Ready
