import React from 'react';
import { OptionsListProps } from '../../types/form.types';

export const OptionsList: React.FC<OptionsListProps> = ({
  options,
  onOptionAdd,
  onOptionChange,
  onOptionDelete
}) => {
  return (
    <div className="mt-4">
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full">
              <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
            </div>
            
            <input
              type="text"
              value={option.text}
              onChange={(e) => onOptionChange(index, { ...option, text: e.target.value })}
              className="flex-grow px-4 py-2 border rounded-lg hover:border-blue-300 focus:border-blue-500 focus:outline-none bg-white"
              placeholder="Enter an option..."
            />
            
            <button
              onClick={() => onOptionDelete(index)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
              title="Delete option"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => onOptionAdd({ text: '', value: '' })}
        className="mt-4 flex items-center gap-2 text-sm text-white px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Option
      </button>
    </div>
  );
};
