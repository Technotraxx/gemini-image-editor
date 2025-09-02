'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewProps {
  images: string[];
  quickActions?: any[];
  onActionSelect?: (action: any) => void;
  loading?: boolean;
  onRemoveImage: (index: number) => void;
  onPreviewImage: (imageUrl: string) => void;
}

export function ImagePreview({ 
  images, 
  quickActions = [],
  onActionSelect,
  loading = false,
  onRemoveImage, 
  onPreviewImage 
}: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-3">
        <span className="text-sm text-gray-600">
          {images.length} image{images.length > 1 ? 's' : ''} selected
        </span>
      </div>
      
      <div className="flex items-start gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <Image
              src={image}
              alt={`Selected ${index + 1}`}
              width={120}
              height={120}
              className="rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity shadow-sm border border-gray-200"
              onClick={() => onPreviewImage(image)}
            />
            <Button
              onClick={() => onRemoveImage(index)}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-90 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {/* Quick Actions inline with images */}
        {quickActions.length > 0 && (
          <div className="flex flex-col gap-2 ml-2">
            <span className="text-sm text-gray-600 font-medium">Quick Actions:</span>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className={`text-xs px-3 py-1.5 h-auto border-gray-300 hover:bg-gray-50 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !loading && onActionSelect?.(action)}
                  disabled={loading}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}