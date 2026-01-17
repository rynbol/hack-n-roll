import GeminiProvider from './gemini.js';

/**
 * AI Provider Factory
 * Creates and manages AI providers (Gemini)
 */
class AIProviderFactory {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = process.env.AI_DEFAULT_PROVIDER || 'gemini';
  }

  /**
   * Initialize providers with API keys from environment
   */
  initializeProviders() {
    // Initialize Gemini if API key is available
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const gemini = new GeminiProvider(process.env.GEMINI_API_KEY);
        this.providers.set('gemini', gemini);
        console.log('✓ Gemini AI provider initialized');
      } catch (error) {
        console.warn('⚠ Gemini AI provider failed to initialize:', error.message);
      }
    }

    if (this.providers.size === 0) {
      console.warn(
        '⚠ No AI providers initialized. Set GEMINI_API_KEY in .env'
      );
    }
  }

  /**
   * Get a specific AI provider
   * @param {string} providerName - Name of the provider ('gemini')
   * @returns {Object} AI provider instance
   * @throws {Error} If provider is not available
   */
  getProvider(providerName = null) {
    const name = providerName || this.defaultProvider;

    if (!this.providers.has(name)) {
      const available = Array.from(this.providers.keys()).join(', ');
      throw new Error(
        `AI provider '${name}' not available. Available providers: ${available || 'none'}`
      );
    }

    return this.providers.get(name);
  }

  /**
   * Get list of available providers
   * @returns {Array<string>} Array of provider names
   */
  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is available
   * @param {string} providerName - Name of the provider
   * @returns {boolean}
   */
  isProviderAvailable(providerName) {
    return this.providers.has(providerName);
  }

  /**
   * Set the default provider
   * @param {string} providerName - Name of the provider
   */
  setDefaultProvider(providerName) {
    if (!this.isProviderAvailable(providerName)) {
      throw new Error(`Provider '${providerName}' is not available`);
    }
    this.defaultProvider = providerName;
    console.log(`Default AI provider set to: ${providerName}`);
  }

  /**
   * Get the default provider name
   * @returns {string}
   */
  getDefaultProvider() {
    return this.defaultProvider;
  }
}

// Create and export singleton instance
const factory = new AIProviderFactory();
factory.initializeProviders();

export default factory;
