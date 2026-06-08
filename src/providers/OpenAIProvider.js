class OpenAIProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'openai';
    this.model = 'gpt-4';
  }
  getName() { return this.name; }
  getModel() { return this.model; }
}
module.exports = OpenAIProvider;
