const { AnthropicProvider } = require('./AnthropicProvider.js');
const { OpenAIProvider } = require('./OpenAIProvider.js');
const { GeminiProvider } = require('./GeminiProvider.js');
const { OllamaProvider } = require('./OllamaProvider.js');

class LLMProviderFactory {
  static getProvider(name) {
    const providers = {
      anthropic: AnthropicProvider,
      claude: AnthropicProvider,
      openai: OpenAIProvider,
      gemini: GeminiProvider,
      ollama: OllamaProvider
    };
    return providers[name.toLowerCase()];
  }

  static createProvider(name, config) {
    const Provider = this.getProvider(name);
    if (!Provider) throw new Error(`Unknown provider: ${name}`);
    return new Provider(config);
  }
}

module.exports = { LLMProviderFactory };
