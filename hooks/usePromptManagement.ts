import { useState, useEffect, useRef } from 'react';
import { Prompt, ExportData } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export function usePromptManagement() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load prompts from localStorage on mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem(STORAGE_KEYS.GEMINI_PROMPTS);
    const savedQuickPrompts = localStorage.getItem(STORAGE_KEYS.GEMINI_QUICK_PROMPTS);
    
    if (savedPrompts) {
      try {
        const parsed = JSON.parse(savedPrompts);
        const promptsWithDates = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));
        setPrompts(promptsWithDates);
      } catch (error) {
        console.error('Failed to parse saved prompts:', error);
      }
    }
    
    if (savedQuickPrompts) {
      try {
        setQuickPrompts(JSON.parse(savedQuickPrompts));
      } catch (error) {
        console.error('Failed to parse saved quick prompts:', error);
      }
    }
  }, []);

  const addPrompt = () => {
    if (!newPromptTitle.trim() || !newPromptContent.trim()) return;

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: newPromptTitle.trim(),
      content: newPromptContent.trim(),
      createdAt: new Date(),
    };

    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    localStorage.setItem(STORAGE_KEYS.GEMINI_PROMPTS, JSON.stringify(updatedPrompts));
    
    setNewPromptTitle('');
    setNewPromptContent('');
    
    toast({
      title: "Prompt Added",
      description: `"${newPrompt.title}" has been added to your library.`,
    });
  };

  const updatePrompt = () => {
    if (!editingPrompt || !newPromptTitle.trim() || !newPromptContent.trim()) return;

    const updatedPrompts = prompts.map(p =>
      p.id === editingPrompt.id
        ? { ...p, title: newPromptTitle.trim(), content: newPromptContent.trim() }
        : p
    );
    
    setPrompts(updatedPrompts);
    localStorage.setItem(STORAGE_KEYS.GEMINI_PROMPTS, JSON.stringify(updatedPrompts));
    
    setEditingPrompt(null);
    setNewPromptTitle('');
    setNewPromptContent('');
    
    toast({
      title: "Prompt Updated",
      description: `"${newPromptTitle}" has been updated.`,
    });
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    const updatedQuickPrompts = quickPrompts.filter(qp => qp !== id);
    
    setPrompts(updatedPrompts);
    setQuickPrompts(updatedQuickPrompts);
    localStorage.setItem(STORAGE_KEYS.GEMINI_PROMPTS, JSON.stringify(updatedPrompts));
    localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_PROMPTS, JSON.stringify(updatedQuickPrompts));
    
    toast({
      title: "Prompt Deleted",
      description: "The prompt has been removed from your library.",
    });
  };

  const toggleQuickPrompt = (id: string) => {
    const updatedQuickPrompts = quickPrompts.includes(id)
      ? quickPrompts.filter(qp => qp !== id)
      : [...quickPrompts, id];
    
    setQuickPrompts(updatedQuickPrompts);
    localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_PROMPTS, JSON.stringify(updatedQuickPrompts));
  };

  const startEditingPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setNewPromptTitle(prompt.title);
    setNewPromptContent(prompt.content);
  };

  const cancelEditing = () => {
    setEditingPrompt(null);
    setNewPromptTitle('');
    setNewPromptContent('');
  };

  const exportPrompts = () => {
    const exportData: ExportData = {
      prompts,
      quickPrompts,
      quickActions: [],
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-prompts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Exported ${prompts.length} prompts successfully.`,
    });
  };

  const importPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!importData.prompts || !Array.isArray(importData.prompts)) {
          throw new Error('Invalid file format: missing prompts array');
        }
        
        const importedPrompts: Prompt[] = importData.prompts.map((p: any) => {
          if (!p.id || !p.title || !p.content) {
            throw new Error('Invalid prompt structure in file');
          }
          return {
            ...p,
            createdAt: new Date(p.createdAt || new Date())
          };
        });
        
        const existingIds = new Set(prompts.map(p => p.id));
        const newPrompts = importedPrompts.filter(p => !existingIds.has(p.id));
        const mergedPrompts = [...prompts, ...newPrompts];
        
        let mergedQuickPrompts = quickPrompts;
        if (importData.quickPrompts && Array.isArray(importData.quickPrompts)) {
          const validQuickPrompts = importData.quickPrompts.filter((id: string) => 
            mergedPrompts.some(p => p.id === id)
          );
          mergedQuickPrompts = [...new Set([...quickPrompts, ...validQuickPrompts])];
        }
        
        setPrompts(mergedPrompts);
        setQuickPrompts(mergedQuickPrompts);
        localStorage.setItem(STORAGE_KEYS.GEMINI_PROMPTS, JSON.stringify(mergedPrompts));
        localStorage.setItem(STORAGE_KEYS.GEMINI_QUICK_PROMPTS, JSON.stringify(mergedQuickPrompts));
        
        toast({
          title: "Import Complete",
          description: `Imported ${newPrompts.length} new prompts. ${importedPrompts.length - newPrompts.length} duplicates were skipped.`,
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
    prompts,
    quickPrompts,
    isPromptLibraryOpen,
    setIsPromptLibraryOpen,
    editingPrompt,
    newPromptTitle,
    setNewPromptTitle,
    newPromptContent,
    setNewPromptContent,
    importInputRef,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleQuickPrompt,
    startEditingPrompt,
    cancelEditing,
    exportPrompts,
    importPrompts,
  };
}