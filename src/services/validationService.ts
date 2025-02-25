import { IQuestion, QuestionType, ValidationRule, TextValidation, NumberValidation, RangeValue } from '../types/form.types';
import { validateContains, validateEmail, validateGreaterThan, validateLessThan, validateMaxLength, validateMinLength, validateRange, validateURL } from '../utils/validators';

export const ValidationMessages = {
  REQUIRED_TITLE: 'Question title is required',
  MIN_OPTIONS: 'Add at least 2 options',
  UNIQUE_OPTIONS: 'Options must be unique',
  INVALID_RANGE: 'Range values must be numbers',
  INVALID_RANGE_ORDER: 'Maximum value must be greater than minimum value',
  EMAIL: 'Please enter a valid email address',
  URL: 'Please enter a valid URL',
  CONTAINS: (value: string) => `Must contain: ${value}`,
  MIN_LENGTH: (value: number) => `Minimum length: ${value} characters`,
  MAX_LENGTH: (value: number) => `Maximum length: ${value} characters`,
  GREATER_THAN: (value: number) => `Must be greater than ${value}`,
  LESS_THAN: (value: number) => `Must be less than ${value}`,
  RANGE: (min: number, max: number) => `Must be between ${min} and ${max}`
};

const validateDropdownQuestion = (
  question: IQuestion, 
  isPublishing: boolean,
  checkCompletion: boolean,
  errors: string[]
): void => {
  const options = question.options || [];
  const nonEmptyOptions = options.filter(opt => 
    typeof opt.text === 'string' && opt.text.trim()
  );

  if (isPublishing || checkCompletion) {
    if (nonEmptyOptions.length < 2) {
      errors.push(ValidationMessages.MIN_OPTIONS);
    } else {
      const uniqueOptions = new Set(nonEmptyOptions.map(opt => opt.text.trim()));
      if (uniqueOptions.size !== nonEmptyOptions.length) {
        errors.push(ValidationMessages.UNIQUE_OPTIONS);
      }
    }
  }
};

const validateNumberQuestion = (question: IQuestion, errors: string[]): void => {
  if (question.validation?.type === 'range') {
    const range = question.validation.value as RangeValue;
    if (range.min !== null && range.max !== null && range.max.toString().length > 0) {
      if (isNaN(range.min) || isNaN(range.max)) {
        errors.push(ValidationMessages.INVALID_RANGE);
      } else if (range.max <= range.min) {
        errors.push(ValidationMessages.INVALID_RANGE_ORDER);
      }
    }
  }
};

export const validateQuestion = (
  question: IQuestion,
  isPublishing: boolean = false,
  checkCompletion: boolean = true
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!question.title?.trim()) {
    errors.push(ValidationMessages.REQUIRED_TITLE);
  }

  switch (question.type) {
    case QuestionType.Dropdown:
      validateDropdownQuestion(question, isPublishing, checkCompletion, errors);
      break;
    case QuestionType.Number:
      validateNumberQuestion(question, errors);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateField = (value: string | number, validation: ValidationRule): boolean => {
  if (!validation || validation.type === 'none') return true;

  switch (validation.type) {
    case TextValidation.Email:
      return validateEmail(value as string);
    case TextValidation.URL:
      return validateURL(value as string);
    case TextValidation.Contains:
      return validateContains(value as string, validation.value as string);
    case TextValidation.MinLength:
      return validateMinLength(value as string, Number(validation.value));
    case TextValidation.MaxLength:
      return validateMaxLength(value as string, Number(validation.value));
    case NumberValidation.GreaterThan:
      return validateGreaterThan(Number(value), Number(validation.value));
    case NumberValidation.LessThan:
      return validateLessThan(Number(value), Number(validation.value));
    case NumberValidation.Range: {
      const rangeValue = validation.value as RangeValue;
      return validateRange(Number(value), rangeValue);
    }
    default:
      return true;
  }
};

export const getValidationMessage = (validation: ValidationRule): string => {
  if (!validation || validation.type === 'none') return '';
  if (validation.message) return validation.message;

  switch (validation.type) {
    case TextValidation.Email:
      return ValidationMessages.EMAIL;
    case TextValidation.URL:
      return ValidationMessages.URL;
    case TextValidation.Contains:
      return ValidationMessages.CONTAINS(validation.value as string);
    case TextValidation.MinLength:
      return ValidationMessages.MIN_LENGTH(Number(validation.value));
    case TextValidation.MaxLength:
      return ValidationMessages.MAX_LENGTH(Number(validation.value));
    case NumberValidation.GreaterThan:
      return ValidationMessages.GREATER_THAN(Number(validation.value));
    case NumberValidation.LessThan:
      return ValidationMessages.LESS_THAN(Number(validation.value));
    case NumberValidation.Range: {
      const range = validation.value as RangeValue;
      return ValidationMessages.RANGE(range.min!, range.max!);
    }
    default:
      return '';
  }
}; 