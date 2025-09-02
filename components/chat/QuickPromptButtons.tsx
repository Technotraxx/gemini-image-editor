'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prompt } from '@/types';

interface QuickPromptButtonsProps {
  quickPrompts: string[];
  prompts: Prompt[];
  onQuickPrompt: (promptId: string) => void;
}

export function QuickPromptButtons({ quickPrompts, prompts, onQuickPrompt }: QuickPromptButtonsProps) {
  if (quickPrompts.length === 0) return null;

  return (
    <div className="border-b bg-gray-50 p-3">
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((promptId) => {
          const prompt = prompts.find(p => p.id === promptId);
          if (!prompt) return null;
          
          return (
            <Badge
              key={promptId}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200 transition-colors px-3 py-1"
              onClick={() => onQuickPrompt(promptId)}
            >
              {prompt.title}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}