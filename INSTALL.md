# Installation Guide

## Requirements

- Node.js 18+
- npm 8+
- API key (Anthropic, OpenAI, or Gemini)

## Option A: NPM Package

```bash
npm install triage-os
```

Then create `.env`:
ANTHROPIC_API_KEY=sk-...
TRIAGE_PROVIDER=anthropic

## Option B: From GitHub

```bash
git clone https://github.com/fsosnik/triage.git
cd triage
npm install

cp .env.example .env
# Edit .env with your keys

npm test    # Verify
npm start   # Run dashboard
```

## Providers

| Provider | Key | Env Var |
|----------|-----|---------|
| Anthropic (Claude) | sk-ant-... | `ANTHROPIC_API_KEY` |
| OpenAI (GPT-4) | sk-proj-... | `OPENAI_API_KEY` |
| Google (Gemini) | AIza... | `GOOGLE_API_KEY` |
| Local (Ollama) | (none) | `TRIAGE_PROVIDER=ollama` |

Set provider:
```bash
export TRIAGE_PROVIDER=anthropic  # or openai, gemini, ollama
```

## Verification

```bash
npm test                    # Tests
npm run validate           # Structure check
curl http://localhost:3000/health  # Health (after npm start)
```

## Troubleshooting

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "API key invalid"**
- Verify `.env` has correct key
- Check provider is set: `echo $TRIAGE_PROVIDER`

**Port 3000 in use**
```bash
npm start -- --port 3001
```

## Docker (Optional)

```bash
docker build -t triage-os .
docker run -e ANTHROPIC_API_KEY=sk-... -p 3000:3000 triage-os
```
