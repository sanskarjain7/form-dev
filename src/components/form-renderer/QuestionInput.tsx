import { IQuestion, QuestionType, NumberValidation, RangeValue, TextValidation } from '../../types/form.types';
import { validateField, getValidationMessage } from '../../services/validationService';
import { useState, useEffect, useCallback } from 'react';

interface QuestionInputProps {
  question: IQuestion;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  value,
  onChange,
}) => {
  const [error, setError] = useState<string>('');

  const validateInput = useCallback((newValue: string) => {
    if (question.validation) {
      const isValid = validateField(newValue, question.validation);
      setError(isValid ? '' : getValidationMessage(question.validation));
    }
  }, [question.validation]);

  useEffect(() => {
    validateInput(value);
  }, [value, validateInput]);

  const range = question.type === QuestionType.Number && question.validation?.type === NumberValidation.Range 
    ? question.validation.value as RangeValue 
    : null;

  const inputClasses = "w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  switch (question.type) {
    case QuestionType.Text:
      return (
        <div>
          <input
            type={question.validation?.type === TextValidation.Email ? 'email' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className={inputClasses}
            placeholder="Your answer"
            pattern={question.validation?.type === TextValidation.URL ? "https?://.+" : undefined}
            title={
              question.validation?.type === TextValidation.URL 
                ? "Please enter a valid URL starting with http:// or https://"
                : undefined
            }
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      );

    case QuestionType.Number:
      return (
        <div>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            min={range?.min ?? undefined}
            max={range?.max ?? undefined}
            className={inputClasses}
            placeholder="Your answer"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      );

    case QuestionType.Dropdown:
      return (
        <div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option.text}>
                {option.text}
              </option>
            ))}
          </select>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      );

    default:
      return null;
  }
}; 