import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude AI Provider for photo analysis and profile generation
 * Uses Anthropic's Claude Vision API
 */
class ClaudeProvider {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for Claude provider');
    }
    this.client = new Anthropic({apiKey});
    this.model = 'claude-3-5-sonnet-20241022';
  }

  /**
   * Analyze a photo and extract characteristics
   * @param {Buffer} imageBuffer - The image data as a buffer
   * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg')
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePhoto(imageBuffer, mimeType = 'image/jpeg') {
    try {
      const base64Image = imageBuffer.toString('base64');

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Analyze this photo of a college student. Provide a JSON response with the following structure:
{
  "description": "Brief physical description",
  "vibe": "Overall vibe/energy (e.g., casual, studious, athletic, creative)",
  "traits": ["trait1", "trait2", "trait3"],
  "interests": ["interest1", "interest2", "interest3"]
}

Be observant, positive, and focus on details that would help create an interesting student profile. Consider clothing style, setting, expressions, and any visible interests or hobbies.`,
              },
            ],
          },
        ],
      });

      const content = response.content[0].text;
      return JSON.parse(content);
    } catch (error) {
      console.error('Claude photo analysis error:', error);
      throw new Error(`Claude analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate a profile based on photo analysis and user context
   * @param {Object} photoAnalysis - Results from analyzePhoto
   * @param {Object} userContext - Additional context (major, classes, etc.)
   * @returns {Promise<Object>} Generated profile content
   */
  async generateProfile(photoAnalysis, userContext = {}) {
    try {
      const prompt = `Create a fun, engaging student profile bio based on this analysis:

Photo Analysis: ${JSON.stringify(photoAnalysis)}
Student Context:
- Major: ${userContext.major || 'Unknown'}
- University: ${userContext.university || 'Unknown'}
- Classes: ${userContext.classes?.join(', ') || 'None specified'}

Generate a JSON response with:
{
  "bio": "A short, witty, and characteristic bio (2-3 sentences max). Make it fun and authentic, like a real student would write. Use humor and personality!",
  "personality_traits": ["trait1", "trait2", "trait3", "trait4"],
  "conversation_starters": [
    "question or topic 1",
    "question or topic 2",
    "question or topic 3"
  ]
}

Make the bio sound natural and student-like. Incorporate the major and interests in a fun way. The conversation starters should be relevant to their major/interests and easy to respond to.`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0].text;
      return JSON.parse(content);
    } catch (error) {
      console.error('Claude profile generation error:', error);
      throw new Error(`Claude generation failed: ${error.message}`);
    }
  }

  /**
   * Get the provider name
   * @returns {string}
   */
  getName() {
    return 'claude';
  }
}

export default ClaudeProvider;
