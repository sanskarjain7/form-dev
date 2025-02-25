import { useEffect, useRef, useCallback } from 'react';
import { FormResponse } from '../types/form.types';

const AUTOSAVE_INTERVAL = 3000; // 3 seconds

export const useFormResponseAutosave = (formId: string, responses: FormResponse) => {
  const timeoutRef = useRef<number>();

  const saveResponses = useCallback(async () => {
    try {
      localStorage.setItem(`formResponse_${formId}`, JSON.stringify(responses));
    } catch (error) {
      console.error('Response autosave failed:', error);
    }
  }, [formId, responses]);

  // Save on interval
  useEffect(() => {
    timeoutRef.current = window.setInterval(saveResponses, AUTOSAVE_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [saveResponses]);

  // Save on responses change
  useEffect(() => {
    saveResponses();
  }, [responses, saveResponses]);

  return { saveResponses };
}; 