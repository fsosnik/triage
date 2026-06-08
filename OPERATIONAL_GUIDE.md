# TRIAGE OS — Operational Guide

## System Administration

### 1. Installation

```bash
# Clone repository
git clone https://github.com/fsosnik/triage.git
cd triage

# Install dependencies
npm install

# Verify installation
npm test                # Should show 126/126 PASS
npm run validate:structure  # Should show OK
```

### 2. Starting the Service

```bash
# Development
npm start
# 🚀 TRIAGE OS running on http://localhost:3000

# Production (with PM2)
pm2 start src/api/server.js --name triage-os
pm2 save
```

### 3. Health Monitoring

```bash
# Health check
curl http://localhost:3000/health

# Metrics
curl http://localhost:3000/metrics

# Patterns learned
curl http://localhost:3000/patterns

# Checkpoints saved
curl http://localhost:3000/checkpoints
```

---

## Maintenance

### Daily Tasks
```bash
# Verify service is up
curl http://localhost:3000/health

# Check logs for errors
tail -f logs/triage-os.log

# Review metrics
curl http://localhost:3000/metrics
```

### Weekly Tasks
```bash
# Run full test suite
npm test

# Check for vulnerabilities
npm audit

# Review learned patterns
cat .claude/patterns/successes.json | jq '.[] | .name'

# Check checkpoint size
du -sh .claude/checkpoints/
```

### Monthly Tasks
```bash
# Archive old checkpoints
mkdir -p archives/checkpoints-$(date +%Y-%m)
mv .claude/checkpoints/* archives/checkpoints-$(date +%Y-%m)/

# Backup patterns
cp .claude/patterns/* archives/patterns-$(date +%Y-%m)/

# Vacuum blocklist (remove outdated entries)
# Manual review: cat .claude/patterns/blocklist.json
```

---

## Troubleshooting

### Issue: Port already in use
```bash
# Find and kill process
lsof -ti :3000 | xargs kill -9

# Restart
npm start
```

### Issue: Out of memory
```bash
# Check memory usage
ps aux | grep node

# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Issue: Tests failing
```bash
# Clear cache
rm -rf node_modules/.cache
npm test
```

### Issue: API not responding
```bash
# Check if server is running
ps aux | grep "node src/api/server.js"

# Check network
netstat -tlnp | grep 3000

# Restart
npm start
```

---

## Backup & Recovery

### Create Backup
```bash
# Backup all state
tar -czf triage-os-backup-$(date +%Y-%m-%d).tar.gz \
  .claude/patterns/ \
  .claude/checkpoints/ \
  node_modules/package*.json

# Store safely
mv triage-os-backup*.tar.gz /secure/backup/location/
```

### Restore from Backup
```bash
# Restore patterns and checkpoints
tar -xzf triage-os-backup-2026-06-08.tar.gz

# Verify restoration
npm test
npm start
```

---

## Performance Tuning

### Optimize Agent Execution
```javascript
// src/core/triage-os-core.js
// Adjust parallelism
const parallelism = 5;  // Default: all agents parallel
```

### Optimize Storage
```bash
# Archive old patterns monthly
find .claude/checkpoints -mtime +90 -delete

# Compress patterns
gzip .claude/patterns/successes.json
```

---

## Monitoring

### Key Metrics to Track

API Response Time

Target: <3 seconds for full cycle
Alert if: >5 seconds


Test Pass Rate

Target: 100%
Alert if: <95%


Pattern Success Rate

Target: >90%
Alert if: <80%


Memory Usage

Target: <500MB
Alert if: >1GB


Disk Usage

Target: <1GB for .claude/
Archive if: >500MB




### Monitoring Setup (Optional)
```bash
# Install monitoring
npm install pm2-monitoring

# Setup alerts
pm2 install pm2-auto-restart
```

---

## Scaling

### Horizontal Scaling (Multiple Instances)
```bash
# With PM2
pm2 start src/api/server.js -i max --name triage-os

# With Load Balancer
# Put nginx/haproxy in front of 3000, 3001, 3002
```

### Vertical Scaling (Single Instance)
```bash
NODE_OPTIONS=--max-old-space-size=8192 npm start
```

---

## Disaster Recovery

### If Service Crashes
```bash
1. Check logs: tail -f logs/triage-os.log
2. Identify issue: npm test
3. Fix if needed: git pull && npm install
4. Restart: npm start
5. Verify: curl http://localhost:3000/health
```

### If Data is Corrupted
```bash
1. Stop service: npm stop
2. Restore from backup: tar -xzf backup.tar.gz
3. Verify: npm test
4. Restart: npm start
```

---

## Documentation

- See DOCUMENTATION_INDEX.md for all guides
- See USER_GUIDE.md for how to use
- See TECHNICAL_REFERENCE.md for internals
- See DEPLOYMENT.md for Docker

---

**Status**: Production Ready  
**Version**: 1.3.0-alpha.0
