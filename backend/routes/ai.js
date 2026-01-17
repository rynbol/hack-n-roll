import express from 'express';
import aiProviderFactory from '../services/ai/providers/factory.js';

const router = express.Router();

/**
 * GET /api/ai/providers
 * Get list of available AI providers
 */
router.get('/providers', (req, res) => {
  try {
    const providers = aiProviderFactory.getAvailableProviders();
    const defaultProvider = aiProviderFactory.getDefaultProvider();

    res.json({
      success: true,
      providers: providers.map(name => ({
        name,
        isDefault: name === defaultProvider,
        available: true,
      })),
      default: defaultProvider,
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      error: 'Failed to get providers',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/test
 * Test AI provider with sample text
 */
router.post('/test', async (req, res) => {
  try {
    const {provider} = req.body;

    if (!provider) {
      return res.status(400).json({error: 'provider name is required'});
    }

    const aiProvider = aiProviderFactory.getProvider(provider);

    // Simple test to verify provider is working
    const testContext = {
      major: 'Computer Science',
      university: 'Test University',
      classes: ['CS 101', 'Math 201'],
    };

    const testAnalysis = {
      description: 'Test photo analysis',
      vibe: 'studious',
      traits: ['focused', 'friendly', 'tech-savvy'],
      interests: ['coding', 'gaming', 'coffee'],
    };

    const result = await aiProvider.generateProfile(testAnalysis, testContext);

    res.json({
      success: true,
      provider: provider,
      message: 'Provider is working correctly',
      sample: result,
    });
  } catch (error) {
    console.error('Test provider error:', error);
    res.status(500).json({
      error: 'Provider test failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/ai/status
 * Get AI service status
 */
router.get('/status', (req, res) => {
  try {
    const providers = aiProviderFactory.getAvailableProviders();
    const hasProviders = providers.length > 0;

    res.json({
      success: true,
      status: hasProviders ? 'operational' : 'unavailable',
      message: hasProviders
        ? 'AI services are operational'
        : 'No AI providers configured',
      providers: providers,
      totalProviders: providers.length,
    });
  } catch (error) {
    console.error('Get AI status error:', error);
    res.status(500).json({
      error: 'Failed to get AI status',
      message: error.message,
    });
  }
});

export default router;
