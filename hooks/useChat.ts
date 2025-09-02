import { useState, useRef } from 'react';
import { Message, ChatSettings, QuickAction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { sendToGemini } from '@/lib/geminiService';

// Parse commands from AI response
function parseCommands(text: string): string[] {
  // Match various command formats
  const commandsMatch = text.match(/(?:QUICK\s+)?(?:EDIT\s+)?COMMANDS?:\s*([\s\S]*?)(?:\n\n|\*\*|$)/i) ||
                       text.match(/(?:SUGGESTIONS?|ACTIONS?|STEPS?):\s*([\s\S]*?)(?:\n\n|\*\*|$)/i) ||
                       text.match(/(?:REMOVE|EDIT|MODIFY|ENHANCE|IMPROVE):\s*([\s\S]*?)(?:\n\n|\*\*|$)/i);
  
  if (!commandsMatch) return [];
  
  const commandsText = commandsMatch[1];
  const commands = commandsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => (/^\d+\.\s+/.test(line) || /^-\s+/.test(line) || /^\*\s+/.test(line)) && line.length > 3)
    .map(line => {
      // Extract everything after the number/bullet, removing any brackets
      return line.replace(/^(?:\d+\.\s*|-\s*|\*\s*)/, '').replace(/^\[|\]$/g, '');
    })
    .filter(cmd => cmd.length > 0);
  
  console.log('Parsed commands:', commands);
  return commands;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [messageCommands, setMessageCommands] = useState<Record<string, string[]>>({});
  const lastUsedSettings = useRef<ChatSettings | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (settings: ChatSettings) => {
    if (!input.trim() && selectedImages.length === 0) return;
    if (!settings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in settings.",
        variant: "destructive",
      });
      return;
    }

    // Store settings for command execution
    lastUsedSettings.current = settings;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input, // Keep full content for manual input
      isUser: true,
      timestamp: new Date(),
      images: selectedImages.length > 0 ? selectedImages : undefined,
      originalPrompt: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input; // Keep full input for API call
    const currentImages = selectedImages;
    setInput('');
    setSelectedImages([]); // Clear images immediately after creating user message

    try {
      // For now, send the first image to maintain API compatibility
      // TODO: Update API to handle multiple images
      const imageToSend = selectedImages.length > 0 ? selectedImages[0] : null;
      const data = await sendToGemini(currentInput, imageToSend, settings);
      
      // Check if this is an image editing request (has images and editing-related content)
      const isImageEdit = currentImages.length > 0 && (
        currentInput.toLowerCase().includes('edit') ||
        currentInput.toLowerCase().includes('change') ||
        currentInput.toLowerCase().includes('modify') ||
        currentInput.toLowerCase().includes('enhance') ||
        currentInput.toLowerCase().includes('improve') ||
        currentInput.toLowerCase().includes('adjust') ||
        currentInput.toLowerCase().includes('make') ||
        data.images && data.images.length > 0
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        isUser: false,
        timestamp: new Date(),
        images: data.images || [],
        originalImages: isImageEdit ? currentImages : undefined,
        originalPrompt: userMessage.originalPrompt || currentInput, // Use the user's original prompt
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Parse commands from the response
      const commands = parseCommands(data.text);
      if (commands.length > 0) {
        setMessageCommands(prev => ({
          ...prev,
          [aiMessage.id]: commands
        }));
      }
      
      setSelectedImages([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpload = (files: File[] | React.ChangeEvent<HTMLInputElement>) => {
    // Handle both File[] and ChangeEvent
    const fileList = Array.isArray(files) ? files : Array.from(files.target.files || []);
    
    if (fileList.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (selectedImages.length + fileList.length > 8) {
      toast({
        title: "Too Many Images",
        description: `You can only upload up to 8 images. Currently selected: ${selectedImages.length}`,
        variant: "destructive",
      });
      return;
    }
    
    const newImages: string[] = [];
    let processedCount = 0;
    
    fileList.forEach((file) => {
      // Create an image element to preserve original dimensions
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Preserve original dimensions - don't resize
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Draw image at original size
        ctx?.drawImage(img, 0, 0);
        
        // Convert to high-quality base64 (preserve original format if possible)
        const mimeType = file.type || 'image/jpeg';
        const quality = mimeType === 'image/jpeg' ? 0.95 : undefined; // High quality for JPEG
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        newImages.push(dataUrl);
        processedCount++;
        
        if (processedCount === fileList.length) {
          setSelectedImages(prev => [...prev, ...newImages]);
          toast({
            title: "Images Added",
            description: `${fileList.length} image${fileList.length > 1 ? 's' : ''} added successfully.`,
          });
        }
      };
      
      // Read file as data URL to load into image element
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input if it's a ChangeEvent
    if (!Array.isArray(files)) {
      files.target.value = '';
    }
  };

  const handleImageReuse = (imageUrl: string) => {
    if (selectedImages.length >= 8) {
      toast({
        title: "Maximum Images Reached",
        description: "You can only have up to 8 images selected.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedImages(prev => [...prev, imageUrl]);
    toast({
      title: "Image Selected",
      description: "Image has been added to your next message.",
    });
  };

  const executeQuickAction = (action: QuickAction, settings: ChatSettings) => {
    if (selectedImages.length === 0) return;
    
    // Use image preview model for quick actions
    const actionSettings = { ...settings, model: 'gemini-2.5-flash-image-preview' };
    lastUsedSettings.current = actionSettings;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `🚀 ${action.title}`, // Show action title instead of full prompt
      isUser: true,
      timestamp: new Date(),
      images: selectedImages.length > 0 ? selectedImages : undefined,
      originalPrompt: action.prompt, // Store the full action prompt
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentImages = selectedImages;
    setSelectedImages([]);

    // Send to Gemini
    const imageToSend = currentImages.length > 0 ? currentImages[0] : null;
    sendToGemini(action.prompt, imageToSend, actionSettings) // Still send full prompt to API
      .then(data => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.text,
          isUser: false,
          timestamp: new Date(),
          images: data.images || [],
          originalPrompt: userMessage.originalPrompt || userMessage.content, // Use the user's original prompt
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Parse commands from the response
        const commands = parseCommands(data.text);
        if (commands.length > 0) {
          setMessageCommands(prev => ({
            ...prev,
            [aiMessage.id]: commands
          }));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const selectCommand = (command: string) => {
    // Use currently selected images if available, otherwise fall back to last analyzed images
    const imagesToUse = selectedImages.length > 0 
      ? selectedImages 
      : (() => {
          const lastUserMessage = messages.slice().reverse().find(m => m.isUser && m.images);
          return lastUserMessage?.images || [];
        })();
    
    // Set the command as input and the images
    setInput(command);
    if (selectedImages.length === 0) {
      setSelectedImages(imagesToUse);
    }
    
    // Auto-send the command with images
    setTimeout(() => {
      if (imagesToUse.length > 0) {
        // Show shortened command in chat
        const displayCommand = command.length > 80 ? `✏️ ${command.substring(0, 80)}...` : `✏️ ${command}`;
        
        const userMessage: Message = {
          id: Date.now().toString(),
          content: displayCommand,
          isUser: true,
          timestamp: new Date(),
          images: imagesToUse,
          originalPrompt: command, // Store the full command
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setInput('');
        setSelectedImages([]);

        // Send to Gemini with the command and images
        const imageToSend = imagesToUse.length > 0 ? imagesToUse[0] : null;
        sendToGemini(command, imageToSend, lastUsedSettings.current!) // Still send full command to API
          .then(data => {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: data.text,
              isUser: false,
              timestamp: new Date(),
              images: data.images || [],
              originalPrompt: command, // Store the original command that generated this
            };

            setMessages(prev => [...prev, aiMessage]);
            
            // Parse any new commands from the response
            const newCommands = parseCommands(data.text);
            if (newCommands.length > 0) {
              setMessageCommands(prev => ({
                ...prev,
                [aiMessage.id]: newCommands
              }));
            }
          })
          .catch(error => {
            console.error('Error:', error);
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Something went wrong",
              variant: "destructive",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 100);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  const retryMessage = async (messageIndex: number, settings: ChatSettings) => {
    if (messageIndex < 1 || messageIndex >= messages.length) return;
    
    const messageToRetry = messages[messageIndex];
    if (messageToRetry.isUser) return; // Can't retry user messages
    
    // Find the previous user message
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || !userMessage.isUser) return;
    
    // Remove the AI message we're retrying
    const updatedMessages = messages.slice(0, messageIndex);
    setMessages(updatedMessages);
    setLoading(true);
    setMessageCommands({});
    
    try {
      const data = await sendToGemini(
        userMessage.content, 
        userMessage.images?.[0] || null, 
        settings
      );
      
      const newAiMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        isUser: false,
        timestamp: new Date(),
        images: data.images || [],
        originalPrompt: userMessage.originalPrompt || userMessage.content, // Use original prompt if available
      };

      setMessages(prev => [...prev, newAiMessage]);
      
      // Parse commands from the retry response
      const commands = parseCommands(data.text);
      if (commands.length > 0) {
        setMessageCommands(prev => ({
          ...prev,
          [newAiMessage.id]: commands
        }));
      }
      
    } catch (error) {
      console.error('Retry error:', error);
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      // Restore the original message on error
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedImages([]);
    setInput('');
    setMessageCommands({});
  };

  const dismissCommands = (messageId: string) => {
    setMessageCommands(prev => {
      const updated = { ...prev };
      delete updated[messageId];
      return updated;
    });
  };

  return {
    messages,
    input,
    setInput,
    loading,
    selectedImages,
    removeImage,
    clearImages,
    previewImage,
    setPreviewImage,
    messageCommands,
    selectCommand,
    dismissCommands,
    messagesEndRef,
    fileInputRef,
    sendMessage,
    handleImagesUpload,
    handleImageReuse,
    executeQuickAction,
    retryMessage,
    clearChat,
    scrollToBottom,
  };
}
