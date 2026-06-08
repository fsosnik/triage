class AnthropicProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'anthropic';
    this.model = 'claude-opus-4-6';
  }
  getName() { return this.name; }
  getModel() { return this.model; }
}
module.exports = AnthropicProvider;
