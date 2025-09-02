'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { usePromptManagement } from '@/hooks/usePromptManagement';
import { useQuickActions } from '@/hooks/useQuickActions';
import { ChatInputArea } from '@/components/chat/ChatInputArea';
import { MessageList } from '@/components/chat/MessageList';
import { QuickPromptButtons } from '@/components/chat/QuickPromptButtons';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { PromptLibraryDialog } from '@/components/dialogs/PromptLibraryDialog';
import { QuickActionsDialog } from '@/components/dialogs/QuickActionsDialog';
import { GEMINI_MODELS } from '@/lib/constants';
import {
  Trash2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const settings = useSettings();
  const chat = useChat();
  const promptManagement = usePromptManagement();
  const quickActions = useQuickActions();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chat.scrollToBottom();
  }, [chat.messages]);

  const handleQuickPrompt = (promptId: string) => {
    const prompt = promptManagement.prompts.find(p => p.id === promptId);
    if (prompt) {
      // Set the full content but it will be shortened when displayed in chat
      chat.setInput(prompt.content);
    }
  };

  const handleSendMessage = () => {
    chat.sendMessage(settings.getSettings());
  };

  const handleRetryMessage = (messageIndex: number) => {
    chat.retryMessage(messageIndex, settings.getSettings());
  };

  const handleActionSelect = (action: any) => {
    chat.executeQuickAction(action, settings.getSettings());
  };

  const handleImagePreview = (imageUrl: string) => {
    chat.setPreviewImage(imageUrl);
 };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold">Gemini Chat</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Model Selector */}
          <Select value={settings.model} onValueChange={settings.setModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GEMINI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={chat.clearChat} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          {/* Quick Actions Dialog */}
          <QuickActionsDialog
            isOpen={quickActions.isQuickActionsOpen}
            setIsOpen={quickActions.setIsQuickActionsOpen}
            quickActions={quickActions.quickActions}
            editingAction={quickActions.editingAction}
            newActionTitle={quickActions.newActionTitle}
            setNewActionTitle={quickActions.setNewActionTitle}
            newActionPrompt={quickActions.newActionPrompt}
            setNewActionPrompt={quickActions.setNewActionPrompt}
            importInputRef={quickActions.importInputRef}
            onAddAction={quickActions.addAction}
            onUpdateAction={quickActions.updateAction}
            onDeleteAction={quickActions.deleteAction}
            onStartEditingAction={quickActions.startEditingAction}
            onCancelEditing={quickActions.cancelEditing}
            onExportActions={quickActions.exportActions}
            onImportActions={quickActions.importActions}
          />
          
          {/* Prompt Library Dialog */}

          <PromptLibraryDialog
            isOpen={promptManagement.isPromptLibraryOpen}
            setIsOpen={promptManagement.setIsPromptLibraryOpen}
            prompts={promptManagement.prompts}
            quickPrompts={promptManagement.quickPrompts}
            editingPrompt={promptManagement.editingPrompt}
            newPromptTitle={promptManagement.newPromptTitle}
            setNewPromptTitle={promptManagement.setNewPromptTitle}
            newPromptContent={promptManagement.newPromptContent}
            setNewPromptContent={promptManagement.setNewPromptContent}
            importInputRef={promptManagement.importInputRef}
            onAddPrompt={promptManagement.addPrompt}
            onUpdatePrompt={promptManagement.updatePrompt}
            onDeletePrompt={promptManagement.deletePrompt}
            onToggleQuickPrompt={promptManagement.toggleQuickPrompt}
            onStartEditingPrompt={promptManagement.startEditingPrompt}
            onCancelEditing={promptManagement.cancelEditing}
            onExportPrompts={promptManagement.exportPrompts}
            onImportPrompts={promptManagement.importPrompts}
            onUsePrompt={chat.setInput}
          />

          {/* Settings Dialog */}



          <SettingsDialog
            apiKey={settings.apiKey}
            setApiKey={settings.setApiKey}
            model={settings.model}
            setModel={settings.setModel}
            temperature={settings.temperature}
            setTemperature={settings.setTemperature}
            topK={settings.topK}
            setTopK={settings.setTopK}
            topP={settings.topP}
            setTopP={settings.setTopP}
            maxOutputTokens={settings.maxOutputTokens}
            setMaxOutputTokens={settings.setMaxOutputTokens}
            imageAnalysisPrompt={settings.imageAnalysisPrompt}
            setImageAnalysisPrompt={settings.setImageAnalysisPrompt}
            safetySettings={settings.safetySettings}
            setSafetySettings={settings.setSafetySettings}
          />
        </div>
      </div>

      {/* Quick Prompts */}
      {promptManagement.prompts.length > 0 && (
        <div className="border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Prompts:</span>
            
            {/* Quick/Favorite Prompts as badges */}
            {promptManagement.quickPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {promptManagement.quickPrompts.map((promptId) => {
                  const prompt = promptManagement.prompts.find(p => p.id === promptId);
                  if (!prompt) return null;
                  
                  return (
                    <button
                      key={promptId}
                      onClick={() => handleQuickPrompt(promptId)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {prompt.title}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Small dropdown for all prompts */}
            <Select onValueChange={(promptId) => {
              const prompt = promptManagement.prompts.find(p => p.id === promptId);
              if (prompt) {
                chat.setInput(prompt.content);
              }
            }}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="All..." />
              </SelectTrigger>
              <SelectContent>
                {promptManagement.prompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Messages */}
      {chat.messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Gemini Chat</h2>
              <p className="text-gray-600 mb-6">
                Start a conversation with AI! Upload images and ask questions about them.
              </p>
            </div>

            {/* Drag and Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-8 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => chat.fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  chat.handleImagesUpload(files);
                }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop images here or click to upload</h3>
              <p className="text-gray-500 mb-4">
                You can upload images and ask questions about them
              </p>
              <Button variant="outline" className="mx-auto">
                Choose Images
              </Button>
            </div>

            {/* Conversation Starters */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Try these conversation starters:
              </h3>
              
              <div className="space-y-3 flex flex-col items-center">
                {[
                  "I'm uploading a photo of myself. Can you suggest 5 hairstyles that would suit my face shape and give me tips on what to tell my stylist?",
                  "Here's my living room. What are the top 5 changes I could make to modernize the space without replacing the furniture?",
                  "I'm uploading a photo of my fridge contents. Can you suggest 3 different meals I could make with these ingredients and tell me which nutrients I'm missing?",
                  "Here's my vacation photo. Can you identify the location, suggest the best edits to make it Instagram-worthy, and recommend similar destinations I might enjoy?",
                  "This is my LinkedIn profile photo. Rate its professionalism on a scale of 1-10 and tell me exactly what to change for different industries (tech, finance, creative)."
                ].map((starter, index) => (
                  <div
                    key={index}
                    className="w-full max-w-2xl"
                    onClick={() => chat.setInput(starter)}
                  >
                    <div className="w-full bg-blue-500 text-white rounded-2xl px-6 py-4 cursor-pointer hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed text-left">
                          {starter}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MessageList
          ref={chat.messagesEndRef}
          messages={chat.messages}
          loading={chat.loading}
          messageCommands={chat.messageCommands}
          onImageReuse={chat.handleImageReuse}
          onImagePreview={handleImagePreview}
          onRetryMessage={handleRetryMessage}
          onCommandSelect={chat.selectCommand}
          onDismissCommands={chat.dismissCommands}
        />
      )}

      {/* Chat Input */}
      <ChatInputArea
        input={chat.input}
        setInput={chat.setInput}
        loading={chat.loading}
        selectedImages={chat.selectedImages}
        messageCommands={chat.messageCommands}
        prompts={promptManagement.prompts}
        onRemoveImage={chat.removeImage}
        onSendMessage={handleSendMessage}
        onImagesUpload={chat.handleImagesUpload}
        onCommandSelect={chat.selectCommand}
        onPreviewImage={handleImagePreview}
        quickActions={quickActions.quickActions}
        onActionSelect={handleActionSelect}
        fileInputRef={chat.fileInputRef}
        settings={settings.getSettings()}
        onDismissCommands={chat.dismissCommands}
      />

      {/* Image Preview Dialog */}
      <Dialog open={!!chat.previewImage} onOpenChange={() => chat.setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {chat.previewImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image
                  src={chat.previewImage}
                  alt="Preview"
                  width={600}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}