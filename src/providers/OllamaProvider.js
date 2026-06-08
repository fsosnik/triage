class OllamaProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'ollama';
    this.model = config.model || 'llama2';
  }
  getName() { return this.name; }
  getModel() { return this.model; }
}
module.exports = OllamaProvider;
