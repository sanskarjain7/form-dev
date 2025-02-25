import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SubmissionSuccessProps {
  onSubmitAnother: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onSubmitAnother }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Form Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your response. Your submission has been recorded.
          </p>
          <button
            onClick={onSubmitAnother}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    </div>
  );
}; 