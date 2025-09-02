import { useState, useEffect, useRef } from 'react';
import { QuickAction } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'analyze-image',
    title: 'Analyze Image',
    prompt: `# Quick Image Analysis

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
    createdAt: new Date(),
  },
];

export function useQuickActions() {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<QuickAction | null>(null);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionPrompt, setNewActionPrompt] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load actions from localStorage on mount
  useEffect(() => {
    const savedActions = localStorage.getItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS);
    
    if (savedActions) {
      try {
        const parsed = JSON.parse(savedActions);
        const actionsWithDates = parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt)
        }));
        setQuickActions(actionsWithDates);
      } catch (error) {
        console.error('Failed to parse saved quick actions:', error);
        // If parsing fails, use default actions
        setQuickActions(DEFAULT_ACTIONS);
        localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(DEFAULT_ACTIONS));
      }
    } else {
      // First time - set default actions
      setQuickActions(DEFAULT_ACTIONS);
      localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(DEFAULT_ACTIONS));
    }
  }, []);

  const addAction = () => {
    if (!newActionTitle.trim() || !newActionPrompt.trim()) return;

    const newAction: QuickAction = {
      id: Date.now().toString(),
      title: newActionTitle.trim(),
      prompt: newActionPrompt.trim(),
      createdAt: new Date(),
    };

    const updatedActions = [...quickActions, newAction];
    setQuickActions(updatedActions);
    localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(updatedActions));
    
    setNewActionTitle('');
    setNewActionPrompt('');
    
    toast({
      title: "Quick Action Added",
      description: `"${newAction.title}" has been added to your actions.`,
    });
  };

  const updateAction = () => {
    if (!editingAction || !newActionTitle.trim() || !newActionPrompt.trim()) return;

    const updatedActions = quickActions.map(a =>
      a.id === editingAction.id
        ? { ...a, title: newActionTitle.trim(), prompt: newActionPrompt.trim() }
        : a
    );
    
    setQuickActions(updatedActions);
    localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(updatedActions));
    
    setEditingAction(null);
    setNewActionTitle('');
    setNewActionPrompt('');
    
    toast({
      title: "Quick Action Updated",
      description: `"${newActionTitle}" has been updated.`,
    });
  };

  const deleteAction = (id: string) => {
    const updatedActions = quickActions.filter(a => a.id !== id);
    
    setQuickActions(updatedActions);
    localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(updatedActions));
    
    toast({
      title: "Quick Action Deleted",
      description: "The action has been removed from your library.",
    });
  };

  const startEditingAction = (action: QuickAction) => {
    setEditingAction(action);
    setNewActionTitle(action.title);
    setNewActionPrompt(action.prompt);
  };

  const cancelEditing = () => {
    setEditingAction(null);
    setNewActionTitle('');
    setNewActionPrompt('');
  };

  const exportActions = () => {
    const exportData = {
      prompts: [],
      quickActions,
      quickPrompts: [],
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-quick-actions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Exported ${quickActions.length} quick actions successfully.`,
    });
  };

  const importActions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!importData.quickActions || !Array.isArray(importData.quickActions)) {
          throw new Error('Invalid file format: missing quickActions array');
        }
        
        const importedActions: QuickAction[] = importData.quickActions.map((a: any) => {
          if (!a.id || !a.title || !a.prompt) {
            throw new Error('Invalid action structure in file');
          }
          return {
            ...a,
            createdAt: new Date(a.createdAt || new Date())
          };
        });
        
        const existingIds = new Set(quickActions.map(a => a.id));
        const newActions = importedActions.filter(a => !existingIds.has(a.id));
        const mergedActions = [...quickActions, ...newActions];
        
        setQuickActions(mergedActions);
        localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_ACTIONS, JSON.stringify(mergedActions));
        
        toast({
          title: "Import Complete",
          description: `Imported ${newActions.length} new actions. ${importedActions.length - newActions.length} duplicates were skipped.`,
        });
        
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Invalid file format",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return {
    quickActions,
    isQuickActionsOpen,
    setIsQuickActionsOpen,
    editingAction,
    newActionTitle,
    setNewActionTitle,
    newActionPrompt,
    setNewActionPrompt,
    importInputRef,
    addAction,
    updateAction,
    deleteAction,
    startEditingAction,
    cancelEditing,
    exportActions,
    importActions,
  };
}