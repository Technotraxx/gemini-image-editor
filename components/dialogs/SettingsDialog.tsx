'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { GEMINI_MODELS, SAFETY_LEVELS } from '@/lib/constants';

interface SettingsDialogProps {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  topK: number;
  setTopK: React.Dispatch<React.SetStateAction<number>>;
  topP: number;
  setTopP: React.Dispatch<React.SetStateAction<number>>;
  maxOutputTokens: number;
  setMaxOutputTokens: React.Dispatch<React.SetStateAction<number>>;
  imageAnalysisPrompt: string;
  setImageAnalysisPrompt: React.Dispatch<React.SetStateAction<string>>;
  safetySettings: {
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  };
  setSafetySettings: React.Dispatch<React.SetStateAction<{
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  }>>;
}

export function SettingsDialog({
  apiKey,
  setApiKey,
  model,
  setModel,
  temperature,
  setTemperature,
  topK,
  setTopK,
  topP,
  setTopP,
  maxOutputTokens,
  setMaxOutputTokens,
  imageAnalysisPrompt,
  setImageAnalysisPrompt,
  safetySettings,
  setSafetySettings,
}: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gemini Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
            />
            <p className="text-sm text-gray-500">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
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
          </div>

          {/* Image Analysis Prompt */}
          <div className="space-y-2">
            <Label htmlFor="image-analysis-prompt">Image Analysis Prompt</Label>
            <Textarea
              id="image-analysis-prompt"
              value={imageAnalysisPrompt}
              onChange={(e) => setImageAnalysisPrompt(e.target.value)}
              placeholder="Enter your custom image analysis prompt..."
              className="min-h-[120px]"
            />
            <p className="text-sm text-gray-500">
              This prompt will be used when analyzing images. Use "QUICK EDIT COMMANDS:" followed by numbered options in brackets to create clickable buttons.
            </p>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Advanced Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="top-k">Top K: {topK}</Label>
                <input
                  id="top-k"
                  type="range"
                  min="1"
                  max="100"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="top-p">Top P: {topP}</Label>
                <input
                  id="top-p"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Output Tokens: {maxOutputTokens}</Label>
                <input
                  id="max-tokens"
                  type="range"
                  min="1"
                  max="8192"
                  value={maxOutputTokens}
                  onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Safety Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Safety Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(safetySettings).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Label>
                  <Select
                    value={value}
                    onValueChange={(newValue) =>
                      setSafetySettings((prev: any) => ({ ...prev, [key]: newValue }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SAFETY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}