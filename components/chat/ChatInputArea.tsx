'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { ImageIcon, Send, Hash } from 'lucide-react';
import { ImagePreview } from './ImagePreview';
import { CommandButtons } from './CommandButtons';
import { ChatSettings, Prompt } from '@/types';
import { QuickAction } from '@/types';
import { useState, useEffect } from 'react';

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  selectedImages: string[];
  messageCommands: Record<string, string[]>;
  prompts: Prompt[];
  onRemoveImage: (index: number) => void;
  onSendMessage: () => void;
  onImagesUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCommandSelect: (command: string) => void;
  onPreviewImage: (imageUrl: string) => void;
  quickActions: QuickAction[];
  onActionSelect: (action: QuickAction) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  settings: ChatSettings;
  onDismissCommands?: (messageId: string) => void;
}

export function ChatInputArea({
  input,
  setInput,
  loading,
  selectedImages = [],
  messageCommands,
  prompts,
  onRemoveImage,
  onSendMessage,
  onImagesUpload,
  onCommandSelect,
  onPreviewImage,
  quickActions,
  onActionSelect,
  fileInputRef,
  settings,
  onDismissCommands = () => {},
}: ChatInputAreaProps) {
  const { textareaRef, handleChange } = useAutoResizeTextarea();
  const [showPromptMenu, setShowPromptMenu] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!showPromptMenu) {
        onSendMessage();
      }
    }
    if (e.key === 'Escape') {
      setShowPromptMenu(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    handleChange(e, setInput);
    
    // Check for / command
    if (value === '/' || (value.startsWith('/') && value.length > 1)) {
      const searchTerm = value.slice(1).toLowerCase();
      const filtered = prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.content.toLowerCase().includes(searchTerm)
      );
      setFilteredPrompts(filtered);
      setShowPromptMenu(true);
    } else {
      setShowPromptMenu(false);
    }
  };

  const selectPrompt = (prompt: Prompt) => {
    setInput(prompt.content);
    setShowPromptMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPromptMenu(false);
    };
    
    if (showPromptMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPromptMenu]);
  return (
    <div className="border-t bg-white p-4">
      <ImagePreview
        images={selectedImages}
        quickActions={selectedImages.length > 0 ? quickActions : []}
        onActionSelect={onActionSelect}
        loading={loading}
        onRemoveImage={onRemoveImage}
        onPreviewImage={onPreviewImage}
      />
      
      {Object.values(messageCommands || {}).flat().length > 0 && (
        <CommandButtons
          commands={Object.values(messageCommands || {}).flat()}
          onCommandSelect={onCommandSelect}
          onClose={() => {
            // Clear all commands from all messages
            Object.keys(messageCommands || {}).forEach(messageId => {
              onDismissCommands(messageId);
            });
          }}
          loading={loading}
        />
      )}
      
      <div className="flex gap-3 items-end relative">
        {/* Image Upload Button - Left Side */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="h-12 w-12"
            disabled={selectedImages.length >= 8}
            title={selectedImages.length >= 8 ? "Maximum 8 images allowed" : "Upload images"}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Text Input - Center */}
        <div className="flex-1 min-w-0 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask Gemini anything... (Type / for prompts)"
            className="min-h-[48px] max-h-[200px] resize-none overflow-y-auto"
            onKeyDown={handleKeyDown}
            style={{ height: '48px' }}
          />
          
          {/* Prompt Menu */}
          {showPromptMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
              <div className="p-2 border-b bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>Select a prompt ({filteredPrompts.length} found)</span>
                </div>
              </div>
              {filteredPrompts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No prompts found. Try a different search term.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  {filteredPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPrompt(prompt);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 focus:bg-blue-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">{prompt.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {prompt.content.length > 100 
                          ? `${prompt.content.substring(0, 100)}...` 
                          : prompt.content
                        }
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Send Button - Right Side */}
        <div className="flex-shrink-0">
          <Button
            onClick={onSendMessage}
            disabled={loading || (!input.trim() && selectedImages.length === 0)}
            size="icon"
            className="h-12 w-12"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}