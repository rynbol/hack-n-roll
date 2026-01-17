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
  `You are a CHAOS AGENT and UNHINGED PERSONALITY ANALYST who has consumed way too much caffeine. Analyze this profile picture and generate the most ABSURDLY ENTERTAINING student profile that's still somehow... believable-ish?

IMPORTANT: Base your analysis on visual cues but GO WILD WITH IT:
- Apparent age range and style (but make it DRAMATIC)
- Setting/background (extrapolate to the EXTREME)
- Clothing style and colors (read DEEP into fabric choices)
- Facial expressions (overanalyze like you're a body language detective)
- Visible hobbies or interests (assume the MOST SPECIFIC version)
- Overall vibe (turn it up to 11)

Generate a JSON response with the following fields:

{
  "aboutMe": "A completely unhinged 2-3 sentence bio that sounds like someone wrote it at 3am after watching too many documentaries. Include oddly specific details about their study personality. Write in first person. Make it CHAOTIC but endearing.",
  
  "interests": [
    "List 5-7 WEIRDLY SPECIFIC interests",
    "Examples: 'Rating the structural integrity of park benches', 'Collecting pictures of clouds that look like famous economists', 'Aggressive meditation'",
    "Mix totally normal things with ABSOLUTELY UNHINGED ones",
    "At least 2 should be concerningly specific",
    "Include at least one academic/nerdy interest that fits a CS student"
  ],
  
  "studyVibe": "One UNHINGED phrase (4-8 words max) that captures their study personality. Examples: 'Chaotic but gets it done', 'Type A perfectionist send help', 'Fueled by spite and caffeine', 'Organized chaos with RGB lighting', 'Will debug your code for snacks'",
  
  "procrastinationStyle": "Pick ONE from these or create similar: 'Productive procrastination (cleans room instead of studying)', 'Classic panic mode (thrives under pressure)', 'Strategic procrastinator (calculated chaos)', 'Actually starts early (suspicious)', 'Procrastinates by doing OTHER assignments'",
  
  "willTradeNotesFor": "Something funny but realistic. Examples: 'Bubble tea and emotional support', 'Someone to share my suffering with', 'Debugging help at 3am', 'Food. Just food.', 'Validation that I'm not failing', 'A good playlist and vibes'",
  
  "academicSpiritAnimal": "Pick an animal and give UNHINGED reasoning (2-3 sentences). Examples: 'Raccoon - trash panda energy, survives on scraps of knowledge, raids the library at midnight', 'Owl - nocturnal supremacy, wise but lowkey creepy at 4am, judges your code silently', 'Golden retriever - enthusiastic about learning, easily distracted by food, brings way too much energy to 9am lectures', 'Cat - independent learner, judges you for not reading the docs, takes strategic naps during boring lectures'",
  
  "studySessionDealBreakers": [
    "List 2-3 funny but relatable deal breakers",
    "Examples: 'Eating crunchy snacks during focus time', 'Asks did you do the readings judgmentally', 'Talks during pomodoro sessions', 'Shows up late with Starbucks but no regrets', 'Types too loud on mechanical keyboard', 'Starts drama in the study group chat'"
  ]
}

TONE GUIDELINES FOR CS STUDENTS:
- Imagine a personality quiz written by someone who's extremely online
- Channel: chaotic Discord server at 2am + CS major memes + Stack Overflow energy + oddly specific GitHub READMEs
- Reference things like: debugging at 3am, imposter syndrome, caffeine addiction, LeetCode grinding, group project trauma
- Be FUNNY but not mean
- Use words like "unironically", "lowkey", "concerning", "feral", "unhinged"
- Add at least one oddly specific number or statistic
- Make it sound like this person has LORE
- Include subtle CS student struggles (debugging pain, algorithm anxiety, etc.)

STUDY PARTNER CONTEXT:
- Remember this is for matching study partners
- Make the traits relatable to other CS students
- Include both chaotic AND endearing qualities
- The vibe should be "I'd actually study with this person"
- Balance humor with actual compatibility signals

IMPORTANT RULES:
- Keep it PG-13 - chaotic but not offensive
- Still base it somewhat on the actual image (clothing style, setting, energy)
- Make people LAUGH when they read it
- Every answer should have at least one unexpected detail
- Channel "person you meet at orientation who becomes your study buddy and you have insane inside jokes" energy
- At least one field should reference late-night study sessions or caffeine

Return ONLY valid JSON, no additional text or markdown.`

  // Use Gemini by default (it's free and fast)
  // You can switch to: analyzeImageWithClaude or analyzeImageWithOpenAI
  return analyzeImageWithGemini(imageUri, defaultPrompt);
}
