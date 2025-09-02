'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuickAction } from '@/types';
import {
  Zap,
  Download,
  Trash2,
  Edit,
  Save,
  X,
  Library,
} from 'lucide-react';

interface QuickActionsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  quickActions: QuickAction[];
  editingAction: QuickAction | null;
  newActionTitle: string;
  setNewActionTitle: (title: string) => void;
  newActionPrompt: string;
  setNewActionPrompt: (prompt: string) => void;
  importInputRef: React.RefObject<HTMLInputElement>;
  onAddAction: () => void;
  onUpdateAction: () => void;
  onDeleteAction: (id: string) => void;
  onStartEditingAction: (action: QuickAction) => void;
  onCancelEditing: () => void;
  onExportActions: () => void;
  onImportActions: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function QuickActionsDialog({
  isOpen,
  setIsOpen,
  quickActions,
  editingAction,
  newActionTitle,
  setNewActionTitle,
  newActionPrompt,
  setNewActionPrompt,
  importInputRef,
  onAddAction,
  onUpdateAction,
  onDeleteAction,
  onStartEditingAction,
  onCancelEditing,
  onExportActions,
  onImportActions,
}: QuickActionsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Zap className="h-4 w-4 mr-1" />
          Actions ({quickActions.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quick Actions</span>
            <div className="flex gap-2">
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                onChange={onImportActions}
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
                onClick={onExportActions}
                variant="outline"
                size="sm"
                disabled={quickActions.length === 0}
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Add/Edit Action Form */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">
                {editingAction ? 'Edit Quick Action' : 'Add New Quick Action'}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="action-title">Title</Label>
                <Input
                  id="action-title"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  placeholder="Enter action title (e.g., 'Analyze Image')..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-prompt">Prompt</Label>
                <Textarea
                  id="action-prompt"
                  value={newActionPrompt}
                  onChange={(e) => setNewActionPrompt(e.target.value)}
                  placeholder="Enter the prompt that will generate 5 commands..."
                  className="min-h-[150px]"
                />
                <p className="text-sm text-gray-500">
                  This prompt should generate 5 clickable commands. Use "EDIT COMMANDS:" format for best results.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingAction ? onUpdateAction : onAddAction}
                  disabled={!newActionTitle.trim() || !newActionPrompt.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {editingAction ? 'Update' : 'Add'} Action
                </Button>
                {editingAction && (
                  <Button onClick={onCancelEditing} variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-2">
              <h3 className="font-medium">Your Quick Actions</h3>
              {quickActions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No quick actions yet. Add your first action above!
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {quickActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                            {action.prompt}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            onClick={() => onStartEditingAction(action)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => onDeleteAction(action.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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