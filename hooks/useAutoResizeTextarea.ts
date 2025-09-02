import { useCallback, useEffect, useRef } from 'react';
import { TEXTAREA_CONFIG } from '@/lib/constants';

export function useAutoResizeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height within bounds
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, TEXTAREA_CONFIG.MIN_HEIGHT),
      TEXTAREA_CONFIG.MAX_HEIGHT
    );
    
    textarea.style.height = `${newHeight}px`;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, onChange?: (value: string) => void) => {
    if (onChange) {
      onChange(e.target.value);
    }
    // Adjust height after state update
    requestAnimationFrame(() => adjustHeight());
  }, [adjustHeight]);

  // Adjust height when content changes programmatically
  useEffect(() => {
    adjustHeight();
  });

  return {
    textareaRef,
    handleChange,
    adjustHeight,
  };
}