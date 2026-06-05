# TRIAGE OS — Deployment Guide

## Local Development

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
npm run dev
# http://localhost:3000
npm test
```

## Docker

### Build

```bash
docker build -t triage:1.0 .
```

### Run

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  triage:1.0
```

### Docker Compose

```yaml
version: '3'
services:
  triage:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    volumes:
      - ./patterns:/app/.claude/patterns
      - ./checkpoints:/app/.claude/checkpoints
```

```bash
docker-compose up -d
```

## Cloud Platforms

### Heroku

```bash
heroku login
heroku create triage-os
git push heroku main
heroku logs --tail
```

### Railway

```bash
railway init
railway up
railway logs
```

### Vercel

```bash
vercel deploy
# Creates serverless function at /api/orchestrate
```

### AWS Lambda

```javascript
// lambda.js
const TRIAGEOS = require('triage/src/core/os');
const os = new TRIAGEOS();

exports.handler = async (event) => {
  const result = await os.orchestrate(JSON.parse(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
```

## PM2 (Linux/Mac Production)

```bash
npm install -g pm2

# Start
pm2 start src/server/dashboard-server.js --name triage

# Monitor
pm2 monit

# Logs
pm2 logs triage

# Restart on reboot
pm2 startup
pm2 save
```

## Nginx Reverse Proxy

```nginx
upstream triage {
  server localhost:3000;
}

server {
  listen 80;
  server_name triage.example.com;

  location / {
    proxy_pass http://triage;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
  }

  location /health {
    access_log off;
    proxy_pass http://triage;
  }
}
```

## Environment Variables

```bash
# .env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
PATTERN_PATH=.claude/patterns
CHECKPOINT_PATH=.claude/checkpoints
```

## Database (Optional)

For persistent storage:

```javascript
// Use PostgreSQL/MongoDB for patterns
const patterns = await db.collection('patterns').find({
  success_rate: { $gt: 0.8 }
}).toArray();
```

## Scaling

### Horizontal

Use load balancer:
LB → triage-1 (port 3001)
→ triage-2 (port 3002)
→ triage-3 (port 3003)

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triage
spec:
  replicas: 3
  selector:
    matchLabels:
      app: triage
  template:
    metadata:
      labels:
        app: triage
    spec:
      containers:
      - name: triage
        image: triage:1.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Monitoring

```bash
# Health check
curl http://localhost:3000/health

# Metrics
curl http://localhost:3000/api/metrics

# Logs (PM2)
pm2 logs triage

# Performance
pm2 monit triage
```

## Backup

```bash
# Backup patterns and checkpoints
tar -czf triage-backup.tar.gz \
  .claude/patterns \
  .claude/checkpoints

# Restore
tar -xzf triage-backup.tar.gz
```

## Security

1. Run as non-root user
2. Use HTTPS/TLS
3. Set rate limits
4. Validate inputs
5. Rotate secrets regularly
6. Monitor logs for anomalies

```bash
# Run as triage user
useradd triage
chown -R triage:triage /opt/triage
su - triage
pm2 start triage
```
