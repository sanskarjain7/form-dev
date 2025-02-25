import { IForm, IQuestion, QuestionType, RangeValue } from '../types/form.types';

export const validateQuestion = (
  question: IQuestion, 
  isPublishing: boolean = false,
  checkCompletion: boolean = true
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation - question must have a title
  if (!question.title?.trim()) {
    errors.push('Question title is required');
  }

  // Type-specific validations
  switch (question.type) {
    case QuestionType.Dropdown: {
      const options = question.options || [];
      const nonEmptyOptions = options.filter(opt => 
        typeof opt.text === 'string' && opt.text.trim()
      );

      if (isPublishing || checkCompletion) {
        if (nonEmptyOptions.length < 2) {
          errors.push('Add at least 2 options');
        } else {
          const uniqueOptions = new Set(nonEmptyOptions.map(opt => opt.text.trim()));
          if (uniqueOptions.size !== nonEmptyOptions.length) {
            errors.push('Options must be unique');
          }
        }
      }
      break;
    }

    case QuestionType.Number: {
      if (question.validation?.type === 'range') {
        const range = question.validation.value as RangeValue;
        // Only validate when both min and max are fully entered
        if (range.min !== null && range.max !== null && range.max.toString().length > 0) {
          if (isNaN(range.min) || isNaN(range.max)) {
            errors.push('Range values must be numbers');
          } else if (range.max <= range.min) {
            errors.push('Maximum value must be greater than minimum value');
          }
        }
      }
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (
  form: IForm,
  isPublishing: boolean = false
): { isValid: boolean; firstErrorIndex: number } => {
  for (let i = 0; i < form.questions.length; i++) {
    const validation = validateQuestion(form.questions[i], isPublishing);
    if (!validation.isValid) {
      return { isValid: false, firstErrorIndex: i };
    }
  }
  return { isValid: true, firstErrorIndex: -1 };
}; 