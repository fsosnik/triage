# TRIAGE OS — Instalación & Configuración

**Versión**: 1.1.0 (Multi-LLM Support)

## 🚀 Quick Start (5 minutos)

### Opción 1: Anthropic Claude (Recomendado)
```bash
cd ~/LocalProjects/Projects/triage
npm install @anthropic-ai/sdk
echo 'export ANTHROPIC_API_KEY="sk-ant-TUAPIKEY"' >> ~/.zshrc
source ~/.zshrc
npm start
```

### Opción 2: OpenAI GPT-4
```bash
cd ~/LocalProjects/Projects/triage
npm install openai
echo 'export OPENAI_API_KEY="sk-TUAPIKEY"' >> ~/.zshrc
source ~/.zshrc
TRIAGE_PROVIDER=openai npm start
```

### Opción 3: Google Gemini
```bash
cd ~/LocalProjects/Projects/triage
npm install @google/generative-ai
echo 'export GOOGLE_API_KEY="AIza-TUAPIKEY"' >> ~/.zshrc
source ~/.zshrc
TRIAGE_PROVIDER=gemini npm start
```

### Opción 4: Ollama (Gratis, Local)
```bash
brew install ollama
nohup ollama serve > ~/ollama.log 2>&1 &
ollama pull llama2
cd ~/LocalProjects/Projects/triage
TRIAGE_PROVIDER=ollama npm start
```

**Docs completa**: `docs/MULTI_LLM_GUIDE.md`
