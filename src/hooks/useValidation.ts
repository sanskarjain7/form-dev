import { useState, useCallback } from 'react';
import { ValidationRule } from '../types/form.types';
import { validateField, getValidationMessage } from '../services/validation';

interface ValidationState {
  isValid: boolean;
  message: string;
}

export const useValidation = (validation?: ValidationRule) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    message: ''
  });

  const validate = useCallback((value: string | number) => {
    if (!validation) {
      setValidationState({ isValid: true, message: '' });
      return true;
    }

    const isValid = validateField(value, validation);
    const message = isValid ? '' : getValidationMessage(validation);
    
    setValidationState({ isValid, message });
    return isValid;
  }, [validation]);

  return {
    isValid: validationState.isValid,
    message: validationState.message,
    validate
  };
};
