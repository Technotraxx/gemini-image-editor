export const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini-api-key',
  GEMINI_MODEL: 'gemini-model',
  GEMINI_TEMPERATURE: 'gemini-temperature',
  GEMINI_TOP_K: 'gemini-top-k',
  GEMINI_TOP_P: 'gemini-top-p',
  GEMINI_MAX_OUTPUT_TOKENS: 'gemini-max-output-tokens',
  GEMINI_SAFETY_SETTINGS: 'gemini-safety-settings',
  GEMINI_IMAGE_ANALYSIS_PROMPT: 'gemini-image-analysis-prompt',
  GEMINI_PROMPTS: 'gemini-prompts',
  GEMINI_QUICK_PROMPTS: 'gemini-quick-prompts',
  GEMINI_QUICK_ACTIONS: 'gemini-quick-actions',
} as const;

export const DEFAULT_SETTINGS = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  imageAnalysisPrompt: `# Quick Image Analysis

**Task:** Analyze this image and suggest 5 simple editing commands to improve or transform it.

**Instructions:**
- Keep suggestions simple and direct
- No technical parameters or numbers
- Focus on practical, visual changes
- Tailor suggestions to what's actually in the image

**Response Format:**
EDIT COMMANDS:
1. [Simple action]
2. [Simple action]
3. [Simple action]
4. [Simple action]
5. [Simple action]

**Example Commands:**
- Remove the background
- Replace background with beach scene
- Make the image brighter
- Change shirt to white business shirt
- Add soft smile to face
- Remove people in background
- Make it look like sunset
- Apply professional makeup look
- Change hairstyle to sleek ponytail
- Blur the background more
- Fix the messy hair
- Make colors more vibrant
- Remove the car in background
- Change weather to sunny
- Make person look directly at camera

**Keep it simple:** Write commands as if explaining to someone who just wants quick improvements without technical details.`,
  safetySettings: {
    harassment: 'BLOCK_MEDIUM_AND_ABOVE',
    hateSpeech: 'BLOCK_MEDIUM_AND_ABOVE',
    sexuallyExplicit: 'BLOCK_MEDIUM_AND_ABOVE',
    dangerousContent: 'BLOCK_MEDIUM_AND_ABOVE',
  },
} as const;

export const GEMINI_MODELS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite' },
  { value: 'gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash Image (Preview)' },
] as const;

export const SAFETY_LEVELS = [
  { value: 'BLOCK_NONE', label: 'Block None' },
  { value: 'BLOCK_ONLY_HIGH', label: 'Block Only High' },
  { value: 'BLOCK_MEDIUM_AND_ABOVE', label: 'Block Medium and Above' },
  { value: 'BLOCK_LOW_AND_ABOVE', label: 'Block Low and Above' },
] as const;

export const TEXTAREA_CONFIG = {
  MIN_HEIGHT: 56,
  MAX_HEIGHT: 200,
  INITIAL_HEIGHT: 56,
} as const;