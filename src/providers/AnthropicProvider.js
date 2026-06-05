import { LLMProvider } from './LLMProvider.js';

export class AnthropicProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'claude-opus-4-6';
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      this.client = new Anthropic({ apiKey: this.apiKey });
    } catch (e) {
      console.warn('[WARN] @anthropic-ai/sdk not installed');
      this.client = null;
    }
  }

  async validate() {
    if (!this.apiKey) throw new Error('ANTHROPIC_API_KEY not set');
    if (!this.client) throw new Error('@anthropic-ai/sdk not installed');
    return true;
  }

  getName() {
    return 'anthropic';
  }

  async chat(messages, options = {}) {
    if (!this.client) throw new Error('Anthropic client not initialized');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    return {
      content: response.content[0].text,
      tokens: {
        input: response.usage?.input_tokens || 0,
        output: response.usage?.output_tokens || 0,
        total: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
      },
      model: this.model
    };
  }

  async stream(messages, onChunk, options = {}) {
    if (!this.client) throw new Error('Anthropic client not initialized');

    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    let totalTokens = 0;
    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        onChunk(event.delta.text);
      }
      if (event.type === 'message_stop') {
        totalTokens = event.message.usage?.output_tokens || 0;
      }
    }

    return { streamed: true, tokens: totalTokens, model: this.model };
  }
}
