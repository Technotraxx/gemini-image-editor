'use client';

import { Message } from '@/types';
import { ImageActions } from './ImageActions';
import { MessageActions } from './MessageActions';
import { CommandButtons } from './CommandButtons';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { BeforeAfterModal } from './BeforeAfterModal';
import Image from 'next/image';
import { forwardRef, useState } from 'react';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messageCommands: Record<string, string[]>;
  onImageReuse: (imageUrl: string) => void;
  onImagePreview: (imageUrl: string) => void;
  onRetryMessage: (messageIndex: number) => void;
  onCommandSelect: (command: string) => void;
  onDismissCommands: (messageId: string) => void;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, loading, messageCommands, onImageReuse, onImagePreview, onRetryMessage, onCommandSelect, onDismissCommands }, ref) => {
    const [fullscreenComparison, setFullscreenComparison] = useState<{
      originalImages: string[];
      generatedImages: string[];
    } | null>(null);

    // Helper function to get the original user prompt for an AI message
    const getOriginalPromptForMessage = (messageIndex: number): string | undefined => {
      // Look for the previous user message
      for (let i = messageIndex - 1; i >= 0; i--) {
        const prevMessage = messages[i];
        if (prevMessage.isUser) {
          // Return the original prompt if available, otherwise the content
          return prevMessage.originalPrompt || prevMessage.content;
        }
      }
      return undefined;
    };

    return (
      <>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with Gemini!</p>
              <p className="text-sm mt-2">You can upload images and ask questions about them.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  
                  {message.images && message.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.images.map((imageUrl, index) => (
                        <div key={index} className="relative group/image">
                          <Image
                            src={imageUrl}
                            alt={`Generated image ${index + 1}`}
                            width={400}
                            height={400}
                            className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => onImagePreview(imageUrl)}
                          />
                          <ImageActions
                            imageUrl={imageUrl}
                            index={index}
                            isUserMessage={message.isUser}
                            onImageReuse={onImageReuse}
                            onImagePreview={onImagePreview}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Before/After Comparison for AI messages with original images */}
                  {!message.isUser && message.originalImages && message.images && (
                    <BeforeAfterComparison
                      originalImages={message.originalImages}
                      generatedImages={message.images}
                      onImagePreview={onImagePreview}
                      onImageReuse={onImageReuse}
                      onOpenFullscreen={() => setFullscreenComparison({
                        originalImages: message.originalImages!,
                        generatedImages: message.images!
                      })}
                    />
                  )}
                  
                  <MessageActions
                    messageContent={message.content}
                    isUserMessage={message.isUser}
                    onRetry={!message.isUser ? () => onRetryMessage(index) : undefined}
                  />
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={ref} />
        </div>

        {/* Full-screen Before/After Modal */}
        {fullscreenComparison && (
          <BeforeAfterModal
            isOpen={!!fullscreenComparison}
            onClose={() => setFullscreenComparison(null)}
            originalImages={fullscreenComparison.originalImages}
            generatedImages={fullscreenComparison.generatedImages}
            onImagePreview={onImagePreview}
            onImageReuse={onImageReuse}
          />
        )}
      </>
    );
  }
);

MessageList.displayName = 'MessageList';