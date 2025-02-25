import { ValidationRule, TextValidation, NumberValidation, RangeValue } from '../types/form.types';
import * as validators from '../utils/validators';

export const validateField = (value: string | number, validation: ValidationRule): boolean => {
  if (!validation || validation.type === 'none') return true;

  switch (validation.type) {
    case TextValidation.Email:
      return validators.validateEmail(value as string);
    
    case TextValidation.URL:
      return validators.validateURL(value as string);
    
    case TextValidation.Contains:
      return validators.validateContains(value as string, validation.value as string);
    
    case TextValidation.MinLength:
      return validators.validateMinLength(value as string, Number(validation.value));
    
    case TextValidation.MaxLength:
      return validators.validateMaxLength(value as string, Number(validation.value));
    
    case NumberValidation.Years:
      return validators.validateYears(Number(value));
    
    case NumberValidation.GreaterThan:
      return validators.validateGreaterThan(Number(value), Number(validation.value));
    
    case NumberValidation.LessThan:
      return validators.validateLessThan(Number(value), Number(validation.value));
    
    case NumberValidation.Range:{
      const rangeValue = validation.value as RangeValue;
      return validators.validateRange(Number(value), rangeValue);
    }
    default:
      return true;
  }
};

export const getValidationMessage = (validation: ValidationRule): string => {
  if (!validation || validation.type === 'none') return '';
  
  if (validation.message) return validation.message;

  // Default messages
  switch (validation.type) {
    case TextValidation.Email:
      return 'Please enter a valid email address';
    case TextValidation.URL:
      return 'Please enter a valid URL';
    case TextValidation.Contains:
      return `Must contain: ${validation.value}`;
    case TextValidation.MinLength:
      return `Minimum length: ${validation.value} characters`;
    case TextValidation.MaxLength:
      return `Maximum length: ${validation.value} characters`;
    case NumberValidation.Years:
      return 'Please enter a valid age (0-150)';
    case NumberValidation.GreaterThan:
      return `Must be greater than ${validation.value}`;
    case NumberValidation.LessThan:
      return `Must be less than ${validation.value}`;
    case NumberValidation.Range:{
      const range = validation.value as RangeValue;
      return `Must be between ${range.min} and ${range.max}`;
    }
    default:
      return '';
  }
};
