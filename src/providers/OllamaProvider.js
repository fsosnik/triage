const { LLMProvider } = require('./LLMProvider.js');

class OllamaProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'llama2';
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }
  async validate() { return true; }
  async complete(prompt, options = {}) { return { text: 'mock' }; }
  async embed(text) { return [0.1, 0.2]; }
}
module.exports = { OllamaProvider };
