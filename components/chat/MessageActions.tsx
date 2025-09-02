'use client';

import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  messageContent: string;
  isUserMessage: boolean;
  onRetry?: () => void;
}

export function MessageActions({ 
  messageContent, 
  isUserMessage, 
  onRetry 
}: MessageActionsProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Message copied to clipboard.",
    });
  };

  return (
    <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-xs opacity-70">
        {new Date().toLocaleTimeString()}
      </span>
      <div className="flex gap-1">
        <Button
          onClick={() => copyToClipboard(messageContent)}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
          title="Copy message"
        >
          <Copy className="h-3 w-3" />
        </Button>
        {!isUserMessage && onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            title="Retry this response"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}