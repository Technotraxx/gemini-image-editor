import { ChatSettings } from '@/types';

export interface GeminiRequest {
  prompt: string;
  image: string | null;
  apiKey: string;
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  safetySettings: {
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  };
}

export interface GeminiResponse {
  text: string;
  images?: string[];
}

export async function sendToGemini(
  prompt: string,
  image: string | null,
  settings: ChatSettings
): Promise<GeminiResponse> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image,
      apiKey: settings.apiKey,
      model: settings.model,
      temperature: settings.temperature,
      topK: settings.topK,
      topP: settings.topP,
      maxOutputTokens: settings.maxOutputTokens,
      safetySettings: settings.safetySettings,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get response');
  }

  return await response.json();
}