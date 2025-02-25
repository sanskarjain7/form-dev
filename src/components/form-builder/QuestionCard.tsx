import React, { useState, useEffect } from 'react';
import { 
  QuestionCardProps, 
  QuestionType, 
  TextValidation, 
  NumberValidation,
  ValidationRule,
  RangeValue,
  IQuestion,
  IOption
} from '../../types/form.types';
import { OptionsList } from './OptionsList';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useValidation } from '../../hooks/useValidation';
import { validateQuestion } from '../../utils/formValidators';

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onQuestionChange,
  onQuestionDelete,
  isActive = false,
}) => {
  const { isValid, message } = useValidation(question.validation);
  const [isExpanded, setIsExpanded] = useState(isActive);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
      const { errors } = validateQuestion(question, true);
      setFormErrors(errors);
    } else {
      setIsExpanded(false);
      setFormErrors([]);
    }
  }, [isActive, question]);

  const isQuestionComplete = question.title?.trim() && (
    question.type !== QuestionType.Dropdown || 
    (question.options && question.options.filter(opt => 
      typeof opt.text === 'string' && opt.text.trim()
    ).length >= 2)
  );

  const toggleExpand = () => {
    if (!isExpanded) {
      const { errors } = validateQuestion(question, true);
      setFormErrors(errors);
    }
    setIsExpanded(!isExpanded);
  };

  const handleTitleChange = (title: string) => {
    validateAndUpdateQuestion({ ...question, title });
  };

  const handleOptionAdd = () => {
    const updatedOptions = [...(question.options || []), { text: '', value: '' }];
    onQuestionChange({ 
      ...question, 
      options: updatedOptions 
    });
  };

  const handleOptionChange = (index: number, option: IOption) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[index] = option;
    onQuestionChange({ 
      ...question, 
      options: updatedOptions 
    });
  };

  const handleOptionDelete = (index: number) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions.splice(index, 1);
    onQuestionChange({ 
      ...question, 
      options: updatedOptions 
    });
  };

  const handleValidationChange = (validation: ValidationRule) => {
    if (validation.type !== question.validation?.type) {
      validation.value = validation.type === NumberValidation.Range 
        ? { min: null, max: null }
        : '';
    }
    
    const updatedQuestion = { 
      ...question, 
      validation 
    };
    validateAndUpdateQuestion(updatedQuestion);
  };

  const handleTypeChange = (type: QuestionType) => {
    const updatedQuestion: IQuestion = {
      ...question,
      type,
      validation: { type: TextValidation.None, value: '' },
      // Initialize empty options array when switching to Dropdown
      options: type === QuestionType.Dropdown ? [] : undefined
    };
    onQuestionChange(updatedQuestion);
  };

  const validateAndUpdateQuestion = (updatedQuestion: IQuestion) => {
    const { errors } = validateQuestion(updatedQuestion);
    setFormErrors(errors);
    onQuestionChange(updatedQuestion);
  };

  const renderValidationOptions = () => {
    switch (question.type) {
      case QuestionType.Text:
        return (
          <select
            value={question.validation?.type || TextValidation.None}
            onChange={(e) => handleValidationChange({ 
              type: e.target.value as TextValidation,
              value: question.validation?.value
            })}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value={TextValidation.None}>No Validation</option>
            <option value={TextValidation.Email}>Email</option>
            <option value={TextValidation.URL}>URL</option>
            <option value={TextValidation.Contains}>Contains</option>
            <option value={TextValidation.MinLength}>Min Length</option>
            <option value={TextValidation.MaxLength}>Max Length</option>
          </select>
        );

      case QuestionType.Number:
        return (
          <select
            value={question.validation?.type || NumberValidation.None}
            onChange={(e) => handleValidationChange({ 
              type: e.target.value as NumberValidation,
              value: question.validation?.value
            })}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value={NumberValidation.None}>No Validation</option>
            <option value={NumberValidation.GreaterThan}>Greater Than</option>
            <option value={NumberValidation.LessThan}>Less Than</option>
            <option value={NumberValidation.Range}>Range</option>
          </select>
        );

      default:
        return null;
    }
  };

  const renderValidationValue = () => {
    if (!question.validation) return null;

    const rangeValue = question.validation?.type === NumberValidation.Range
      ? (question.validation.value as RangeValue) || { min: '', max: '' }
      : { min: '', max: '' };

    switch (question.validation.type) {
      case TextValidation.MinLength:
      case TextValidation.MaxLength:
        return (
          <input
            type="number"
            min="0"
            value={question.validation.value as number || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              onQuestionChange({
                ...question,
                validation: {
                  type: question.validation!.type,
                  value
                }
              });
            }}
            className="text-sm border-gray-300 rounded-md w-20"
            placeholder="Length"
          />
        );

        case NumberValidation.Range:
            return (
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="number"
                  value={rangeValue.min ?? ''}
                  onChange={(e) => handleValidationChange({
                    type: question.validation!.type,
                    value: {
                      ...rangeValue,
                      min: e.target.value ? Number(e.target.value) : null
                    } as RangeValue
                  })}
                  className="w-20 px-2 py-1 border rounded-md text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={rangeValue.max ?? ''}
                  onChange={(e) => handleValidationChange({
                    type: question.validation!.type,
                    value: {
                      ...rangeValue,
                      max: e.target.value ? Number(e.target.value) : null
                    } as RangeValue
                  })}
                  className="w-20 px-2 py-1 border rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            );
      default:
        return (
          <div className="flex flex-col gap-1">
            <input
              type={question.type === QuestionType.Number ? "number" : "text"}
              value={question.validation.value as string}
              onChange={(e) => handleValidationChange({ 
                type: question.validation!.type,
                value: question.type === QuestionType.Number ? 
                  Number(e.target.value) : 
                  e.target.value 
              })}
              className="text-sm border-gray-300 rounded-md w-24"
              placeholder="Value..."
            />
            {!isValid && (
              <span className="text-xs text-red-500">{message}</span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-white border rounded-lg w-full max-w-2xl p-4 flex flex-col">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {question.title.trim() || 'Untitled Question'}
          </span>
          {isQuestionComplete && (
            <span className="text-green-500 text-sm">✓</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuestionDelete();
            }}
            className="p-1.5 text-gray-500 hover:text-red-500 rounded-md hover:bg-gray-100"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <div className="flex items-start gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={question.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg border-0 focus:ring-0 focus:outline-none"
                placeholder="Type your question here..."
              />
              
              {question.type === QuestionType.Dropdown && (
                <OptionsList
                  options={question.options || []}
                  onOptionAdd={() => handleOptionAdd()}
                  onOptionChange={handleOptionChange}
                  onOptionDelete={handleOptionDelete}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={question.type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value={QuestionType.Text}>Text</option>
                <option value={QuestionType.Number}>Number</option>
                <option value={QuestionType.Dropdown}>Dropdown</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              {renderValidationOptions()}
              {renderValidationValue()}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Required</span>
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => onQuestionChange({ 
                  ...question, 
                  required: e.target.checked 
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {(isExpanded || isActive) && formErrors.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded">
          {formErrors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};