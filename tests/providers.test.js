const { LLMProviderFactory } = require('../src/providers/LLMProviderFactory');

describe('LLM Providers', () => {
  test('AnthropicProvider initializes', () => {
    const p = LLMProviderFactory.create('anthropic', { apiKey: 'test' });
    expect(p.getName()).toBe('anthropic');
    expect(p.getModel()).toBe('claude-opus-4-6');
  });

  test('OpenAIProvider initializes', () => {
    const p = LLMProviderFactory.create('gpt', { apiKey: 'test' });
    expect(p.getName()).toBe('openai');
  });

  test('GeminiProvider initializes', () => {
    const p = LLMProviderFactory.create('gemini', { apiKey: 'test' });
    expect(p.getName()).toBe('gemini');
  });

  test('OllamaProvider initializes', () => {
    const p = LLMProviderFactory.create('ollama', { baseUrl: 'http://localhost:11434' });
    expect(p.getName()).toBe('ollama');
  });

  test('aliases work', () => {
    const p1 = LLMProviderFactory.create('claude', { apiKey: 'test' });
    const p2 = LLMProviderFactory.create('anthropic', { apiKey: 'test' });
    expect(p1.getName()).toBe(p2.getName());
  });

  test('throws on unknown provider', () => {
    expect(() => LLMProviderFactory.create('unknown', {})).toThrow();
  });
});
