import { useEffect, useRef, useCallback } from 'react';
import { IForm } from '../types/form.types';
import { formStorageService } from '../services/formStorageService';

const AUTOSAVE_INTERVAL = 3000; // 3 seconds

export const useFormAutosave = (form: IForm) => {
  const timeoutRef = useRef<number | undefined>(undefined);

  const saveProgress = useCallback(async () => {
    try {
      await formStorageService.saveFormProgress(form);
    } catch (error) {
      console.error('Autosave failed:', error);
    }
  }, [form]);

  // Save on interval
  useEffect(() => {
    timeoutRef.current = window.setInterval(saveProgress, AUTOSAVE_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [form, saveProgress]);

  // Save on form changes
  useEffect(() => {
    saveProgress();
  }, [form.questions.length, saveProgress]); // Include saveProgress in dependencies

  return { saveProgress };
}; 