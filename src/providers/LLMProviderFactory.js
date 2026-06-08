const AnthropicProvider = require('./AnthropicProvider');
const OpenAIProvider = require('./OpenAIProvider');
const GeminiProvider = require('./GeminiProvider');
const OllamaProvider = require('./OllamaProvider');

class LLMProviderFactory {
  static providers = {
    anthropic: AnthropicProvider,
    claude: AnthropicProvider,
    openai: OpenAIProvider,
    gemini: GeminiProvider,
    ollama: OllamaProvider
  };

  static create(name, config) {
    const Provider = this.providers[name.toLowerCase()];
    if (!Provider) throw new Error(`Unknown provider: ${name}`);
    return new Provider(config);
  }
}

module.exports = { LLMProviderFactory };
