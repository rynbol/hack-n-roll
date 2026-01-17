import ClaudeProvider from './claude.js';
import OpenAIProvider from './openai.js';

/**
 * AI Provider Factory
 * Creates and manages AI providers (Claude, OpenAI)
 */
class AIProviderFactory {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = process.env.AI_DEFAULT_PROVIDER || 'claude';
  }

  /**
   * Initialize providers with API keys from environment
   */
  initializeProviders() {
    // Initialize Claude if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const claude = new ClaudeProvider(process.env.ANTHROPIC_API_KEY);
        this.providers.set('claude', claude);
        console.log('✓ Claude AI provider initialized');
      } catch (error) {
        console.warn('⚠ Claude AI provider failed to initialize:', error.message);
      }
    }

    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAIProvider(process.env.OPENAI_API_KEY);
        this.providers.set('openai', openai);
        console.log('✓ OpenAI provider initialized');
      } catch (error) {
        console.warn('⚠ OpenAI provider failed to initialize:', error.message);
      }
    }

    if (this.providers.size === 0) {
      console.warn(
        '⚠ No AI providers initialized. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env'
      );
    }
  }

  /**
   * Get a specific AI provider
   * @param {string} providerName - Name of the provider ('claude' or 'openai')
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
