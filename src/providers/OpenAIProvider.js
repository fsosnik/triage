const LLMProvider = require('./LLMProvider');

class OpenAIProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'gpt-4-turbo';
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;

    try {
      const OpenAI = require('openai');
      this.client = new OpenAI({ apiKey: this.apiKey });
    } catch (e) {
      console.warn('[WARN] openai not installed');
      this.client = null;
    }
  }

  async validate() {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY not set');
    if (!this.client) throw new Error('openai not installed');
    return true;
  }

  getName() {
    return 'openai';
  }

  async chat(messages, options = {}) {
    if (!this.client) throw new Error('OpenAI client not initialized');

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    return {
      content: response.choices[0].message.content,
      tokens: {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0
      },
      model: this.model
    };
  }

  async stream(messages, onChunk, options = {}) {
    if (!this.client) throw new Error('OpenAI client not initialized');

    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      stream: true,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    let totalTokens = 0;
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) onChunk(content);
    }

    return { streamed: true, tokens: totalTokens, model: this.model };
  }
}

module.exports = OpenAIProvider;
