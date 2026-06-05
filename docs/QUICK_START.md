# Quick Start (5 minutes)

## Install
```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install
```

## Run
```bash
npm run dev
# http://localhost:3000
```

## Use
```javascript
const TRIAGEOS = require('triage/src/core/os');
const os = new TRIAGEOS();

const result = await os.orchestrate({
  task: 'Implement user signup',
  context: 'Next.js 14',
  constraints: ['tests required']
});

console.log(result.status);  // SUCCESS
```

## Test
```bash
npm test
# 117/119 pass ✅
```

## Next
- [User Manual](USER_MANUAL.md) — Full guide
- [API Guide](API_GUIDE.md) — All methods
- [Architecture](ARCHITECTURE.md) — How it works

That's it. You're ready. 🚀
