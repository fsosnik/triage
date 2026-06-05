const LLMProvider = require('./LLMProvider');

class OllamaProvider extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || 'llama2';
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'\;
  }

  async validate() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) throw new Error('Ollama not responding');
      return true;
    } catch (e) {
      throw new Error(`Ollama unreachable at ${this.baseUrl}`);
    }
  }

  getName() {
    return 'ollama';
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);

    const data = await response.json();
    return {
      content: data.message.content,
      tokens: {
        input: data.prompt_eval_count || 0,
        output: data.eval_count || 0,
        total: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      },
      model: this.model
    };
  }

  async stream(messages, onChunk, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: true
      })
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let totalTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) onChunk(json.message.content);
          if (json.eval_count) totalTokens = json.eval_count;
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }

    return { streamed: true, tokens: totalTokens, model: this.model };
  }
}

module.exports = OllamaProvider;
