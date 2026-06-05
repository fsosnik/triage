import { AnthropicProvider } from './AnthropicProvider.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { OllamaProvider } from './OllamaProvider.js';

export class LLMProviderFactory {
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

  static create(name, config) {
    const Provider = this.providers[name.toLowerCase()];
    if (!Provider) throw new Error(`Unknown provider: ${name}`);
    return new Provider(config);
  }

  static listProviders() {
    return Object.keys(this.providers);
  }
}
