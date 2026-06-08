class GeminiProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'gemini';
    this.model = 'gemini-pro';
  }
  getName() { return this.name; }
  getModel() { return this.model; }
}
module.exports = GeminiProvider;
