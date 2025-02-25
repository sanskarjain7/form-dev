import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IForm } from '../types/form.types';
import { loadForm } from '../services/formService';
import { QuestionInput } from '../components/form-renderer/QuestionInput';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useFormResponseAutosave } from '../hooks/useFormResponseAutosave';
import toast from 'react-hot-toast';
import { SubmissionSuccess } from '../components/form-renderer/SubmissionSuccess';

interface FormResponse {
  [questionId: string]: string;
}

export const FormRenderer = () => {
  const { formId } = useParams();
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Load initial responses from localStorage
  const loadInitialResponses = (): FormResponse => {
    try {
      const savedResponses = localStorage.getItem(`formResponse_${formId}`);
      if (savedResponses) {
        return JSON.parse(savedResponses);
      }
    } catch (error) {
      console.error('Failed to load saved responses:', error);
    }
    return {};
  };

  const [responses, setResponses] = useState<FormResponse>(loadInitialResponses());
  
  useFormResponseAutosave(formId || '', responses);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (formId) {
          const loadedForm = await loadForm(formId);
          setForm(loadedForm);
        }
      } catch (error) {
        console.error('Failed to load form:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const simulateSubmission = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
        setTimeout(() => {
          try {
            // 10% chance of error
            if (Math.random() < 0.1) {
              throw new Error('Failed to submit form');
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };

    const submitPromise = simulateSubmission()
      .then(() => {
        setIsSubmitted(true);
        localStorage.removeItem(`formResponse_${formId}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    toast.promise(submitPromise, {
      loading: 'Submitting responses...',
      success: 'Responses submitted successfully!',
      error: 'Failed to submit responses'
    });
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setResponses({});
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return <div className="text-center p-4">Form not found</div>;
  if (isSubmitted) return <SubmissionSuccess onSubmitAnother={handleSubmitAnother} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 mb-4">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
              <label className="block mb-3 font-medium text-gray-700">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <QuestionInput
                question={question}
                value={responses[question.id] || ''}
                onChange={(value) => handleResponseChange(question.id, value)}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}; 