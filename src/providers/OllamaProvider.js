import { LLMProvider } from './LLMProvider.js';

export class OllamaProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'llama2';
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'\;
  }

  async validate() {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    if (!response.ok) throw new Error(`Ollama unreachable at ${this.baseUrl}`);
    return true;
  }

  getName() {
    return 'ollama';
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, messages, stream: false })
    });

    const data = await response.json();
    return {
      content: data.message.content,
      tokens: { total: (data.prompt_eval_count || 0) + (data.eval_count || 0) },
      model: this.model
    };
  }

  async stream(messages, onChunk, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, messages, stream: true })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(l => l.trim());
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) onChunk(json.message.content);
        } catch (e) {}
      }
    }

    return { streamed: true, model: this.model };
  }
}
