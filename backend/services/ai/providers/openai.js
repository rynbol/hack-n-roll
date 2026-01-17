import OpenAI from 'openai';

/**
 * OpenAI Provider for photo analysis and profile generation
 * Uses GPT-4 Vision API
 */
class OpenAIProvider {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAI provider');
    }
    this.client = new OpenAI({apiKey});
    this.model = 'gpt-4o';
  }

  /**
   * Analyze a photo and extract characteristics
   * @param {Buffer} imageBuffer - The image data as a buffer
   * @param {string} mimeType - The MIME type of the image
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePhoto(imageBuffer, mimeType = 'image/jpeg') {
    try {
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
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
        response_format: {type: 'json_object'},
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI photo analysis error:', error);
      throw new Error(`OpenAI analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate a profile based on photo analysis and user context
   * @param {Object} photoAnalysis - Results from analyzePhoto
   * @param {Object} userContext - Additional context
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

      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {type: 'json_object'},
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI profile generation error:', error);
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
  }

  /**
   * Get the provider name
   * @returns {string}
   */
  getName() {
    return 'openai';
  }
}

export default OpenAIProvider;
