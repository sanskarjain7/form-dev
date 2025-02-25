import { IQuestion, QuestionType, NumberValidation, RangeValue, TextValidation } from '../../types/form.types';

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
  const range = question.type === QuestionType.Number && question.validation?.type === NumberValidation.Range 
    ? question.validation.value as RangeValue 
    : null;

  const inputClasses = "w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  switch (question.type) {
    case QuestionType.Text:
      return (
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
      );

    case QuestionType.Number:
      return (
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
      );

    case QuestionType.Dropdown:
      return (
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
      );

    default:
      return null;
  }
}; 