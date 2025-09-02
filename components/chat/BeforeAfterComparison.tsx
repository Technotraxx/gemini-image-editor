'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Maximize2 } from 'lucide-react';

interface BeforeAfterComparisonProps {
  originalImages: string[];
  generatedImages: string[];
  onImagePreview: (imageUrl: string) => void;
  onImageReuse: (imageUrl: string) => void;
  onOpenFullscreen: () => void;
}

export function BeforeAfterComparison({ 
  originalImages, 
  generatedImages, 
  onImagePreview, 
  onImageReuse,
  onOpenFullscreen
}: BeforeAfterComparisonProps) {
  if (!originalImages.length || !generatedImages.length) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Before & After Available</span>
        </div>
        <Button
          onClick={onOpenFullscreen}
          variant="outline"
          size="sm"
          className="gap-2 bg-white hover:bg-blue-100 border-blue-200 text-blue-700"
        >
          <Maximize2 className="h-4 w-4" />
          Open Full Comparison
        </Button>
      </div>
      <p className="text-sm text-blue-600 mt-2">
        Click to open full-screen comparison with side-by-side view, interactive slider, and toggle modes.
      </p>
    </div>
  );
}
