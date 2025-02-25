import React from 'react';
import { FormHeaderProps } from '../../types/form.types';

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full text-3xl text-gray-700 font-bold mb-3 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none bg-transparent"
        placeholder="What's your form called?"
      />
      <input
        type="text"
        value={description || ''}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full text-gray-700 border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none bg-transparent"
        placeholder="Add a description"
      />
    </div>
  );
};