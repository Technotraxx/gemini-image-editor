'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Prompt } from '@/types';
import {
  Library,
  Download,
  Trash2,
  Edit,
  Star,
  StarOff,
  Save,
  X,
} from 'lucide-react';

interface PromptLibraryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  prompts: Prompt[];
  quickPrompts: string[];
  editingPrompt: Prompt | null;
  newPromptTitle: string;
  setNewPromptTitle: (title: string) => void;
  newPromptContent: string;
  setNewPromptContent: (content: string) => void;
  importInputRef: React.RefObject<HTMLInputElement>;
  onAddPrompt: () => void;
  onUpdatePrompt: () => void;
  onDeletePrompt: (id: string) => void;
  onToggleQuickPrompt: (id: string) => void;
  onStartEditingPrompt: (prompt: Prompt) => void;
  onCancelEditing: () => void;
  onExportPrompts: () => void;
  onImportPrompts: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUsePrompt: (content: string) => void;
}

export function PromptLibraryDialog({
  isOpen,
  setIsOpen,
  prompts,
  quickPrompts,
  editingPrompt,
  newPromptTitle,
  setNewPromptTitle,
  newPromptContent,
  setNewPromptContent,
  importInputRef,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onToggleQuickPrompt,
  onStartEditingPrompt,
  onCancelEditing,
  onExportPrompts,
  onImportPrompts,
  onUsePrompt,
}: PromptLibraryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Library className="h-4 w-4 mr-1" />
          Prompts ({prompts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Prompt Library</span>
            <div className="flex gap-2">
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                onChange={onImportPrompts}
                className="hidden"
              />
              <Button
                onClick={() => importInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Library className="h-3 w-3 mr-1" />
                Import
              </Button>
              <Button
                onClick={onExportPrompts}
                variant="outline"
                size="sm"
                disabled={prompts.length === 0}
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Add/Edit Prompt Form */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">
                {editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="prompt-title">Title</Label>
                <Input
                  id="prompt-title"
                  value={newPromptTitle}
                  onChange={(e) => setNewPromptTitle(e.target.value)}
                  placeholder="Enter prompt title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-content">Content</Label>
                <Textarea
                  id="prompt-content"
                  value={newPromptContent}
                  onChange={(e) => setNewPromptContent(e.target.value)}
                  placeholder="Enter your prompt..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingPrompt ? onUpdatePrompt : onAddPrompt}
                  disabled={!newPromptTitle.trim() || !newPromptContent.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {editingPrompt ? 'Update' : 'Add'} Prompt
                </Button>
                {editingPrompt && (
                  <Button onClick={onCancelEditing} variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Prompts List */}
            <div className="space-y-2">
              <h3 className="font-medium">Your Prompts</h3>
              {prompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No prompts yet. Add your first prompt above!
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {prompts.map((prompt) => (
                    <div key={prompt.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{prompt.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {prompt.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            onClick={() => onToggleQuickPrompt(prompt.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            {quickPrompts.includes(prompt.id) ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => onStartEditingPrompt(prompt)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => onDeletePrompt(prompt.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            onUsePrompt(prompt.content);
                            setIsOpen(false);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Use Prompt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
