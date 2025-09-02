'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  ArrowLeftRight, 
  Download, 
  Move, 
  X,
  Maximize2,
  Grid3X3,
  ToggleLeft
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface BeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImages: string[];
  generatedImages: string[];
  onImagePreview: (imageUrl: string) => void;
  onImageReuse: (imageUrl: string) => void;
}

export function BeforeAfterModal({ 
  isOpen,
  onClose,
  originalImages, 
  generatedImages, 
  onImagePreview, 
  onImageReuse 
}: BeforeAfterModalProps) {
  const [showBefore, setShowBefore] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'toggle'>('side-by-side');
  const { toast } = useToast();

  if (!originalImages.length || !generatedImages.length) return null;

  const downloadImage = (imageUrl: string, type: 'before' | 'after') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${type}-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `${type === 'before' ? 'Original' : 'Enhanced'} image download initiated.`,
    });
  };

  const currentOriginal = originalImages[Math.min(selectedIndex, originalImages.length - 1)];
  const currentGenerated = generatedImages[Math.min(selectedIndex, generatedImages.length - 1)];

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden">
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header */}
          <DialogHeader className="flex items-center justify-between p-6 bg-white border-b shadow-sm flex-row space-y-0">
            <div className="flex items-center gap-4">
              <ArrowLeftRight className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-2xl font-bold text-gray-800">Before & After Comparison</DialogTitle>
              <Badge variant={showBefore ? "secondary" : "default"} className="text-sm">
                {viewMode === 'toggle' ? (showBefore ? 'Original' : 'Enhanced') : 'Full Screen'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'side-by-side' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 px-4"
                  onClick={() => setViewMode('side-by-side')}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Side by Side
                </Button>
                <Button
                  variant={viewMode === 'overlay' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 px-4"
                  onClick={() => setViewMode('overlay')}
                >
                  <Move className="h-4 w-4 mr-2" />
                  Slider
                </Button>
                <Button
                  variant={viewMode === 'toggle' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 px-4"
                  onClick={() => setViewMode('toggle')}
                >
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Toggle
                </Button>
              </div>
              
              {/* Image selector if multiple images */}
              {Math.max(originalImages.length, generatedImages.length) > 1 && (
                <div className="flex gap-2">
                  {Array.from({ length: Math.max(originalImages.length, generatedImages.length) }).map((_, index) => (
                    <Button
                      key={index}
                      variant={selectedIndex === index ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => setSelectedIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Toggle button for toggle mode */}
              {viewMode === 'toggle' && (
                <Button
                  onClick={() => setShowBefore(!showBefore)}
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9"
                >
                  {showBefore ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  Show {showBefore ? 'After' : 'Before'}
                </Button>
              )}
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
                {/* Before Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">Original</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => downloadImage(currentOriginal, 'before')}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        onClick={() => onImageReuse(currentOriginal)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Reuse
                      </Button>
                    </div>
                  </div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-300px)] max-h-[600px]">
                    <Image
                      src={currentOriginal}
                      alt="Original image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* After Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">Enhanced</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => downloadImage(currentGenerated, 'after')}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        onClick={() => onImageReuse(currentGenerated)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Reuse
                      </Button>
                    </div>
                  </div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-300px)] max-h-[600px]">
                    <Image
                      src={currentGenerated}
                      alt="Enhanced image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'overlay' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Interactive Comparison</p>
                  <p className="text-sm text-gray-500">Drag the slider to compare • Left: Original • Right: Enhanced</p>
                </div>
                <div 
                  className="relative w-full rounded-xl overflow-hidden cursor-col-resize select-none shadow-2xl bg-white"
                  style={{ height: 'calc(100vh - 350px)', maxHeight: '700px', minHeight: '400px' }}
                  onClick={handleSliderChange}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      handleSliderChange(e);
                    }
                  }}
                >
                  {/* Enhanced Image (Background) */}
                  <Image
                    src={currentGenerated}
                    alt="Enhanced image"
                    fill
                    className="object-contain"
                  />
                  
                  {/* Original Image (Overlay with clip-path) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <Image
                      src={currentOriginal}
                      alt="Original image"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Slider Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10 cursor-col-resize"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-blue-500">
                      <Move className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-lg font-medium">
                    Original
                  </div>
                  <div className="absolute top-6 right-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-lg font-medium">
                    Enhanced
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'toggle' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Click Image to Toggle</p>
                  <p className="text-sm text-gray-500">Click the image below to switch between Original and Enhanced versions</p>
                </div>
                <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                  <Image
                    src={showBefore ? currentOriginal : currentGenerated}
                    alt={showBefore ? "Original image" : "Enhanced image"}
                    width={800}
                    height={600}
                    className="w-full cursor-pointer object-contain hover:opacity-95 transition-opacity"
                    style={{ height: 'calc(100vh - 300px)', maxHeight: '700px', minHeight: '400px' }}
                    onClick={() => setShowBefore(!showBefore)}
                  />
                  <div className="absolute top-6 left-6">
                    <Badge variant={showBefore ? "secondary" : "default"} className="text-lg px-4 py-2">
                      {showBefore ? 'Original' : 'Enhanced'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-center gap-4 p-6 bg-white border-t">
            <Button
              onClick={() => {
                onImageReuse(currentOriginal);
                onClose();
              }}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Use Original
            </Button>
            <Button
              onClick={() => {
                onImageReuse(currentGenerated);
                onClose();
              }}
              variant="default"
              size="lg"
              className="px-8"
            >
              Use Enhanced
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}