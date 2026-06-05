const AnthropicProvider = require('./AnthropicProvider');
const OpenAIProvider = require('./OpenAIProvider');
const GeminiProvider = require('./GeminiProvider');
const OllamaProvider = require('./OllamaProvider');

class LLMProviderFactory {
  static providers = {
    anthropic: AnthropicProvider,
    claude: AnthropicProvider,
    openai: OpenAIProvider,
    gpt: OpenAIProvider,
    gemini: GeminiProvider,
    google: GeminiProvider,
    ollama: OllamaProvider,
    llama: OllamaProvider
  };

  static create(providerName, config = {}) {
    const ProviderClass = this.providers[providerName.toLowerCase()];
    if (!ProviderClass) {
      throw new Error(
        `Unknown provider: ${providerName}. Available: ${Object.keys(this.providers).join(', ')}`
      );
    }
    return new ProviderClass(config);
  }

  static async createAndValidate(providerName, config = {}) {
    const provider = this.create(providerName, config);
    await provider.validate();
    return provider;
  }

  static listProviders() {
    return Object.keys(this.providers);
  }
}

module.exports = LLMProviderFactory;
