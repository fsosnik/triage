import { LLMProvider } from './LLMProvider.js';

export class AnthropicProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'claude-opus-4-6';
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    this.client = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      this.client = new Anthropic({ apiKey: this.apiKey });
      this.initialized = true;
    } catch (e) {
      console.warn('[WARN] @anthropic-ai/sdk not installed');
    }
  }

  async validate() {
    await this.init();
    if (!this.apiKey) throw new Error('ANTHROPIC_API_KEY not set');
    if (!this.client) throw new Error('@anthropic-ai/sdk not installed');
    return true;
  }

  getName() {
    return 'anthropic';
  }

  async chat(messages, options = {}) {
    await this.init();
    if (!this.client) throw new Error('Anthropic client not initialized');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      messages
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
    await this.init();
    if (!this.client) throw new Error('Anthropic client not initialized');

    const stream = await this.client.messages.stream({
      model: this.model,
      max_tokens: options.max_tokens || 1024,
      messages
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
