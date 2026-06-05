# Quick Commands

## Claude
```bash
cd ~/LocalProjects/Projects/triage
npm install @anthropic-ai/sdk
echo 'export ANTHROPIC_API_KEY="sk-ant-XX"' >> ~/.zshrc
source ~/.zshrc && npm start
```

## GPT-4
```bash
cd ~/LocalProjects/Projects/triage
npm install openai
echo 'export OPENAI_API_KEY="sk-XX"' >> ~/.zshrc
source ~/.zshrc && TRIAGE_PROVIDER=openai npm start
```

## Gemini
```bash
cd ~/LocalProjects/Projects/triage
npm install @google/generative-ai
echo 'export GOOGLE_API_KEY="AIza-XX"' >> ~/.zshrc
source ~/.zshrc && TRIAGE_PROVIDER=gemini npm start
```

## Ollama
```bash
brew install ollama && ollama pull llama2
cd ~/LocalProjects/Projects/triage
TRIAGE_PROVIDER=ollama npm start
```
