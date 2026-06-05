class RufloOptimizer {
  constructor() {
    this.patterns = new Map();
    this.compressionRatio = 0;
  }

  analyzePrompt(prompt) {
    const words = prompt.split(' ').length;
    const unique = new Set(prompt.toLowerCase().split(/\W+/)).size;
    const redundancy = 1 - (unique / words);
    return { words, unique, redundancy };
  }

  compressPrompt(prompt) {
    // Eliminar palabras comunes
    const stopwords = ['the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'were', 'that', 'this'];
    const compressed = prompt
      .split(' ')
      .filter(w => !stopwords.includes(w.toLowerCase()))
      .join(' ');
    
    this.compressionRatio = (compressed.length / prompt.length);
    return { compressed, ratio: this.compressionRatio };
  }

  reuseCachedPattern(prompt, cache) {
    const hash = require('crypto').createHash('sha256').update(prompt).digest('hex');
    if (cache.has(hash)) {
      return { hit: true, cached: cache.get(hash) };
    }
    return { hit: false };
  }

  predictTokens(prompt) {
    // Estimación: ~1.3 tokens por palabra en promedio
    const words = prompt.split(/\s+/).length;
    return Math.ceil(words * 1.3);
  }

  optimizeForProvider(prompt, provider) {
    const analysis = this.analyzePrompt(prompt);
    const compressed = this.compressPrompt(prompt);
    const tokens = this.predictTokens(compressed.compressed);

    return {
      original_tokens: this.predictTokens(prompt),
      optimized_tokens: tokens,
      savings: 100 - (tokens / this.predictTokens(prompt) * 100).toFixed(1) + '%',
      compression_ratio: (this.compressionRatio * 100).toFixed(1) + '%',
      redundancy_detected: (analysis.redundancy * 100).toFixed(1) + '%'
    };
  }
}

module.exports = RufloOptimizer;
