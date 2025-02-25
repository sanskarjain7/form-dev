import { useEffect, useRef, useCallback } from 'react';
import { IForm } from '../types/form.types';
import { StorageService, StorageKeys } from '../services/storageService';

export const useFormAutosave = (form: IForm) => {
  const timeoutRef = useRef<number | undefined>(undefined);

  const saveProgress = useCallback(() => {
    StorageService.setItem(StorageKeys.FORM_PROGRESS, form);
  }, [form]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(saveProgress, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveProgress]);

  return { saveProgress };
}; 