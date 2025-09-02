export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  images?: string[];
  originalImages?: string[];
  originalPrompt?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: Date;
}

export interface ChatSettings {
  apiKey: string;
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  imageAnalysisPrompt: string;
  safetySettings: {
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  };
}

export interface ExportData {
  prompts: Prompt[];
  quickPrompts: string[];
  quickActions: QuickAction[];
  exportDate: string;
  version: string;
}

export interface QuickAction {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
}
