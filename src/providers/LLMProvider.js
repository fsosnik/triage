/**
 * Abstract LLM Provider Interface
 */
export class LLMProvider {
  constructor(config = {}) {
    this.config = config;
    this.model = config.model;
    this.apiKey = config.apiKey;
  }

  async validate() {
    throw new Error('validate() must be implemented');
  }

  async chat(messages, options = {}) {
    throw new Error('chat() must be implemented');
  }

  async stream(messages, onChunk, options = {}) {
    throw new Error('stream() must be implemented');
  }

  getName() {
    throw new Error('getName() must be implemented');
  }

  getModel() {
    return this.model;
  }

  async testConnection() {
    try {
      await this.validate();
      return { success: true, provider: this.getName(), model: this.model };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
