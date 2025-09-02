import { useState, useEffect } from 'react';
import { ChatSettings } from '@/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/lib/constants';

export function useSettings() {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>(DEFAULT_SETTINGS.model);
  const [temperature, setTemperature] = useState<number>(DEFAULT_SETTINGS.temperature);
  const [topK, setTopK] = useState<number>(DEFAULT_SETTINGS.topK);
  const [topP, setTopP] = useState<number>(DEFAULT_SETTINGS.topP);
  const [maxOutputTokens, setMaxOutputTokens] = useState<number>(DEFAULT_SETTINGS.maxOutputTokens);
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState<string>(DEFAULT_SETTINGS.imageAnalysisPrompt);
  const [safetySettings, setSafetySettings] = useState<{
    harassment: string;
    hateSpeech: string;
    sexuallyExplicit: string;
    dangerousContent: string;
  }>(DEFAULT_SETTINGS.safetySettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    const savedModel = localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL);
    const savedTemperature = localStorage.getItem(STORAGE_KEYS.GEMINI_TEMPERATURE);
    const savedTopK = localStorage.getItem(STORAGE_KEYS.GEMINI_TOP_K);
    const savedTopP = localStorage.getItem(STORAGE_KEYS.GEMINI_TOP_P);
    const savedMaxOutputTokens = localStorage.getItem(STORAGE_KEYS.GEMINI_MAX_OUTPUT_TOKENS);
    const savedImageAnalysisPrompt = localStorage.getItem(STORAGE_KEYS.GEMINI_IMAGE_ANALYSIS_PROMPT);
    const savedSafetySettings = localStorage.getItem(STORAGE_KEYS.GEMINI_SAFETY_SETTINGS);

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
    if (savedTemperature) setTemperature(parseFloat(savedTemperature));
    if (savedTopK) setTopK(parseInt(savedTopK));
    if (savedTopP) setTopP(parseFloat(savedTopP));
    if (savedMaxOutputTokens) setMaxOutputTokens(parseInt(savedMaxOutputTokens));
    // Only use saved prompt if it exists, otherwise keep the default
    if (savedImageAnalysisPrompt) {
      setImageAnalysisPrompt(savedImageAnalysisPrompt);
    }
    if (savedSafetySettings) {
      try {
        setSafetySettings(JSON.parse(savedSafetySettings));
      } catch (error) {
        console.error('Failed to parse safety settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (apiKey) localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_TEMPERATURE, temperature.toString());
  }, [temperature]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_TOP_K, topK.toString());
  }, [topK]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_TOP_P, topP.toString());
  }, [topP]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_MAX_OUTPUT_TOKENS, maxOutputTokens.toString());
  }, [maxOutputTokens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_IMAGE_ANALYSIS_PROMPT, imageAnalysisPrompt);
  }, [imageAnalysisPrompt]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_SAFETY_SETTINGS, JSON.stringify(safetySettings));
  }, [safetySettings]);

  const getSettings = (): ChatSettings => ({
    apiKey,
    model,
    temperature,
    topK,
    topP,
    maxOutputTokens,
    imageAnalysisPrompt,
    safetySettings,
  });

  return {
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
    getSettings,
  };
}