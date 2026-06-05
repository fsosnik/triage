# Multi-LLM Provider Setup

## Claude (Anthropic) — Default

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm start
```

Models: claude-opus-4-6, claude-sonnet-4-6, claude-haiku

## GPT-4 (OpenAI)

```bash
export OPENAI_API_KEY="sk-..."
export TRIAGE_PROVIDER=openai
npm start
```

Models: gpt-4-turbo

## Gemini (Google)

```bash
export GOOGLE_API_KEY="AIza-..."
export TRIAGE_PROVIDER=gemini
npm start
```

Models: gemini-2.0-pro

## Ollama (Local, Free)

```bash
brew install ollama
ollama pull llama2
export TRIAGE_PROVIDER=ollama
npm start
```

Models: llama2, mistral, neural-chat

## Benchmarks

| Provider | Speed | Cost | Quality | Setup |
|----------|-------|------|---------|-------|
| Claude | Medium | $$ | Excellent | 1min |
| GPT-4 | Slow | $$$ | Excellent | 1min |
| Gemini | Fast | $ | Good | 1min |
| Ollama | Very Fast | Free | Good | 10min |

## Switch Provider

```bash
TRIAGE_PROVIDER=gemini npm start
```
