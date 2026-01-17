import {GoogleGenerativeAI} from '@google/generative-ai';

/**
 * Gemini AI Provider for photo analysis and profile generation
 * Uses Google's Gemini Vision API
 */
class GeminiProvider {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for Gemini provider');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
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

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      };

      const prompt = `Analyze this photo of a college student. Provide a JSON response with the following structure:
{
  "description": "Brief physical description",
  "vibe": "Overall vibe/energy (e.g., casual, studious, athletic, creative)",
  "traits": ["trait1", "trait2", "trait3"],
  "interests": ["interest1", "interest2", "interest3"]
}

Be observant, positive, and focus on details that would help create an interesting student profile. Consider clothing style, setting, expressions, and any visible interests or hobbies.

IMPORTANT: Return ONLY the JSON object, no markdown formatting or extra text.`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response (handle potential markdown code blocks)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini photo analysis error:', error);
      throw new Error(`Gemini analysis failed: ${error.message}`);
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

Make the bio sound natural and student-like. Incorporate the major and interests in a fun way. The conversation starters should be relevant to their major/interests and easy to respond to.

IMPORTANT: Return ONLY the JSON object, no markdown formatting or extra text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response (handle potential markdown code blocks)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini profile generation error:', error);
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }

  /**
   * Get the provider name
   * @returns {string}
   */
  getName() {
    return 'gemini';
  }
}

export default GeminiProvider;
