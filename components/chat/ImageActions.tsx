'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageActionsProps {
  imageUrl: string;
  index: number;
  isUserMessage: boolean;
  onImageReuse: (imageUrl: string) => void;
  onImagePreview: (imageUrl: string) => void;
}

export function ImageActions({ 
  imageUrl, 
  index, 
  isUserMessage, 
  onImageReuse, 
  onImagePreview 
}: ImageActionsProps) {
  const { toast } = useToast();

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-image-${Date.now()}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Image download has been initiated.",
    });
  };

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity flex gap-1">
      <Button
        onClick={() => onImagePreview(imageUrl)}
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0 shadow-lg bg-white/90 hover:bg-white border-0"
        title="Preview image"
      >
        <Eye className="h-3 w-3" />
      </Button>
      
      {!isUserMessage && (
        <Button
          onClick={() => downloadImage(imageUrl, index)}
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0 shadow-lg bg-white/90 hover:bg-white border-0"
          title="Download image"
        >
          <Download className="h-3 w-3" />
        </Button>
      )}
      
      <Button
        onClick={() => onImageReuse(imageUrl)}
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0 shadow-lg bg-white/90 hover:bg-white border-0"
        title="Reuse this image"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
}