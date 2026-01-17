import * as FileSystem from 'expo-file-system';

// Configure your LLM API settings here
const LLM_CONFIG = {
  // OpenAI GPT-4 Vision
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
  },
  // Anthropic Claude
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
  },
  // Google Gemini
  gemini: {
    model: 'gemini-2.5-flash',
  },
};

// Set your API key here or use environment variables
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Debug: Log if API keys are loaded
console.log('API Keys loaded:');
console.log('  ANTHROPIC:', ANTHROPIC_API_KEY ? 'Yes' : 'No');
console.log('  GEMINI:', GEMINI_API_KEY ? 'Yes' : 'No');

export interface ImageAnalysisResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Converts an image URI to base64 string
 */
export async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Analyzes an image using OpenAI GPT-4 Vision
 */
export async function analyzeImageWithOpenAI(
  imageUri: string,
  prompt: string
): Promise<ImageAnalysisResult> {
  try {
    const base64Image = await imageToBase64(imageUri);

    const response = await fetch(LLM_CONFIG.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_CONFIG.openai.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'OpenAI API request failed',
      };
    }

    return {
      success: true,
      data: data.choices[0]?.message?.content || '',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Analyzes an image using Anthropic Claude
 */
export async function analyzeImageWithClaude(
  imageUri: string,
  prompt: string
): Promise<ImageAnalysisResult> {
  try {
    console.log('Converting image to base64...');
    const base64Image = await imageToBase64(imageUri);
    console.log('Image converted, size:', base64Image.length, 'characters');

    if (!ANTHROPIC_API_KEY) {
      return {
        success: false,
        error: 'ANTHROPIC_API_KEY is not set. Please add it to your .env file.',
      };
    }

    console.log('Sending request to Claude API...');
    const response = await fetch(LLM_CONFIG.anthropic.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: LLM_CONFIG.anthropic.model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || JSON.stringify(data),
      };
    }

    return {
      success: true,
      data: data.content[0]?.text || '',
    };
  } catch (error) {
    console.error('Claude analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Analyzes an image using Google Gemini
 */
export async function analyzeImageWithGemini(
  imageUri: string,
  prompt: string
): Promise<ImageAnalysisResult> {
  try {
    console.log('Converting image to base64...');
    const base64Image = await imageToBase64(imageUri);
    console.log('Image converted, size:', base64Image.length, 'characters');

    if (!GEMINI_API_KEY) {
      return {
        success: false,
        error: 'GEMINI_API_KEY is not set. Please add it to your .env file.',
      };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_CONFIG.gemini.model}:generateContent?key=${GEMINI_API_KEY}`;

    console.log('Sending request to Gemini API...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || JSON.stringify(data),
      };
    }

    return {
      success: true,
      data: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Main function to analyze a profile image
 * Uses Gemini by default, can be switched to Claude or OpenAI
 */
export async function analyzeProfileImage(
  imageUri: string,
): Promise<ImageAnalysisResult> {
  const defaultPrompt =
  `You are a CHAOS AGENT and UNHINGED PERSONALITY ANALYST who has consumed way too much caffeine. Analyze this profile picture and generate the most ABSURDLY ENTERTAINING user profile that's still somehow... believable-ish?

IMPORTANT: Base your analysis on visual cues but GO WILD WITH IT:
- Apparent age range and style (but make it DRAMATIC)
- Setting/background (extrapolate to the EXTREME)
- Clothing style and colors (read DEEP into fabric choices)
- Facial expressions (overanalyze like you're a body language detective)
- Visible hobbies or interests (assume the MOST SPECIFIC version)
- Overall vibe (turn it up to 11)

Generate a JSON response with the following fields:

{
  "bio": "A completely unhinged 2-3 sentence bio that sounds like someone wrote it at 3am after watching too many documentaries. Include oddly specific details. Write in first person. Make it CHAOTIC but endearing.",
  
  "interests": [
    "List 5-7 WEIRDLY SPECIFIC interests",
    "Examples: 'Rating the structural integrity of park benches', 'Collecting pictures of clouds that look like famous economists', 'Aggressive meditation'",
    "Mix totally normal things with ABSOLUTELY UNHINGED ones",
    "At least 2 should be concerningly specific"
  ],
  
  "starSign": "Pick a zodiac sign but be DRAMATIC about it (Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces)",
  
  "starSignReasoning": "An absolutely UNHINGED explanation with too many exclamation marks and wild assumptions. Channel astrology TikTok energy.",
  
  "questionAnswers": {
    "perfectWeekend": "Describe a weekend that starts normal but gets progressively more chaotic. Include at least one unexpected plot twist.",
    "coffeeOrTea": "Pick one but make the reasoning DEEPLY philosophical or completely unhinged. Mention the caffeine-to-existential-dread ratio.",
    "favoriteMusic": "Be oddly specific about genre. Examples: 'Icelandic folk metal', 'lofi beats to overthrow capitalism to', '2000s emo but only the B-sides'",
    "superpower": "Choose something WEIRDLY SPECIFIC and explain why with concerning enthusiasm. Not just 'flying' - something like 'ability to perfectly estimate any container's volume by looking at it'",
    "bucketList": "Something that's 60% achievable, 40% absolutely bonkers. Make it sound like a side quest in a video game."
  },
  
  "personality": {
    "traits": ["4-5 personality traits but make them SPICY", "Mix normal ones with stuff like 'chaotic neutral energy', 'undiagnosed main character syndrome', 'concerningly good at trivia'"],
    "vibe": "One UNHINGED phrase that captures their energy (e.g., 'gaslight, gatekeep, girlboss but make it anxious', 'golden retriever raised by cats', 'lawful evil with good wifi')"
  },
  
  "funFact": "Generate one ABSOLUTELY UNHINGED 'fun fact' that sounds fake but you'll make us believe it. Include unnecessary specifics. Make people go 'wait... really?'"
}

TONE GUIDELINES:
- Imagine a personality quiz written by someone who's extremely online
- Channel the energy of: chaotic group chat at 2am + astrology memes + oddly specific Wikipedia articles
- Be FUNNY but not mean
- Throw in some Gen Z/millennial humor
- Use words like "unironically", "lowkey", "concerning", "feral"
- Add at least one oddly specific number or statistic
- Reference niche interests like they're completely normal
- Make it sound like this person has LORE

IMPORTANT RULES:
- Keep it PG-13 - chaotic but not offensive
- Still base it somewhat on the actual image
- Make people LAUGH when they read it
- Every answer should have at least one unexpected detail
- Channel "person you meet at a party who won't stop telling you insane stories but you're weirdly invested" energy

Return ONLY valid JSON, no additional text or markdown.`

  // Use Gemini by default (it's free and fast)
  // You can switch to: analyzeImageWithClaude or analyzeImageWithOpenAI
  return analyzeImageWithGemini(imageUri, defaultPrompt);
}
