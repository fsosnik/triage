#!/bin/bash
echo "🔧 TRIAGE OS — Multi-LLM Setup"
cd ~/LocalProjects/Projects/triage
echo ""
echo "1. Claude"
echo "2. OpenAI"
echo "3. Gemini"
echo "4. Ollama"
read -p "Opción: " opt

case $opt in
  1) npm install @anthropic-ai/sdk && echo "✅ Done. Add ANTHROPIC_API_KEY to ~/.zshrc" ;;
  2) npm install openai && echo "✅ Done. Add OPENAI_API_KEY to ~/.zshrc" ;;
  3) npm install @google/generative-ai && echo "✅ Done. Add GOOGLE_API_KEY to ~/.zshrc" ;;
  4) brew install ollama && ollama pull llama2 && echo "✅ Done. Run: ollama serve" ;;
esac
