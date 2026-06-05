import { LLMProvider } from './LLMProvider.js';

export class GeminiProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'gemini-2.0-pro';
    this.apiKey = config.apiKey || process.env.GOOGLE_API_KEY;

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      this.client = new GoogleGenerativeAI(this.apiKey);
    } catch (e) {
      console.warn('[WARN] @google/generative-ai not installed');
      this.client = null;
    }
  }

  async validate() {
    if (!this.apiKey) throw new Error('GOOGLE_API_KEY not set');
    if (!this.client) throw new Error('@google/generative-ai not installed');
    return true;
  }

  getName() {
    return 'gemini';
  }

  async chat(messages, options = {}) {
    if (!this.client) throw new Error('Gemini client not initialized');

    const model = this.client.getGenerativeModel({ model: this.model });
    const response = await model.generateContent({
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    });

    const text = response.response.text();
    return {
      content: text,
      tokens: { total: text.split(/\s+/).length },
      model: this.model
    };
  }

  async stream(messages, onChunk, options = {}) {
    const model = this.client.getGenerativeModel({ model: this.model });
    const stream = await model.generateContentStream({
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    });

    for await (const chunk of stream.stream) {
      onChunk(chunk.text());
    }

    return { streamed: true, model: this.model };
  }
}
