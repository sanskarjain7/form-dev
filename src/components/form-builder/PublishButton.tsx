import React from 'react';

interface PublishButtonProps {
  onPublish: () => void;
}

export const PublishButton: React.FC<PublishButtonProps> = ({ onPublish }) => (
  <button
    onClick={onPublish}
    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
  >
    Publish Form
  </button>
); 