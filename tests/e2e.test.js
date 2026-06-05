const { LLMProviderFactory } = require('../src/providers/LLMProviderFactory.js');

describe('E2E: LLM Provider Factory', () => {
  test('should list all providers', () => {
    const providers = LLMProviderFactory.listProviders();
    expect(providers).toContain('anthropic');
    expect(providers).toContain('openai');
    expect(providers).toContain('gemini');
    expect(providers).toContain('ollama');
  });

  test('should create anthropic provider', () => {
    const provider = LLMProviderFactory.create('anthropic', { apiKey: 'test' });
    expect(provider.getName()).toBe('anthropic');
    expect(provider.getModel()).toBe('claude-opus-4-6');
  });

  test('should create openai provider', () => {
    const provider = LLMProviderFactory.create('openai', { apiKey: 'test' });
    expect(provider.getName()).toBe('openai');
  });

  test('should throw on unknown provider', () => {
    expect(() => {
      LLMProviderFactory.create('unknown', {});
    }).toThrow('Unknown provider');
  });

  test('should accept provider aliases', () => {
    const p1 = LLMProviderFactory.create('claude', { apiKey: 'test' });
    const p2 = LLMProviderFactory.create('anthropic', { apiKey: 'test' });
    expect(p1.getName()).toBe(p2.getName());
  });
});
