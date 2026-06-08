const AnthropicProvider = require('./AnthropicProvider');
const OpenAIProvider = require('./OpenAIProvider');
const GeminiProvider = require('./GeminiProvider');
const OllamaProvider = require('./OllamaProvider');

class LLMProviderFactory {
  static create(name, config) {
    const Provider = LLMProviderFactory.providers[name.toLowerCase()];
    if (!Provider) throw new Error(`Unknown provider: ${name}`);
    return new Provider(config);
  }
}

// Asignar después de la clase (compatible con todos los parsers)
LLMProviderFactory.providers = {
  anthropic: AnthropicProvider,
  claude: AnthropicProvider,
  openai: OpenAIProvider,
  gpt: OpenAIProvider,
  gemini: GeminiProvider,
  ollama: OllamaProvider
};

module.exports = { LLMProviderFactory };
