import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IForm, FormResponse } from '../types/form.types';
import { loadForm } from '../services/formService';
import { StorageService, StorageKeys } from '../services/storageService';
import { QuestionInput } from '../components/form-renderer/QuestionInput';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useFormResponseAutosave } from '../hooks/useFormResponseAutosave';
import { simulateAPICall } from '../utils/apiSimulator';
import toast from 'react-hot-toast';
import { SubmissionSuccess } from '../components/form-renderer/SubmissionSuccess';

export const FormRenderer = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [responses, setResponses] = useState<FormResponse>(() => 
    StorageService.getItem(`${StorageKeys.FORM_RESPONSE}${formId}`, {})
  );
  
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

    const submitPromise = simulateAPICall(() => {
      StorageService.removeItem(`${StorageKeys.FORM_RESPONSE}${formId}`);
      setIsSubmitted(true);
    }).finally(() => {
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
          <button
            type="button"
            onClick={() => navigate(`/`)}
            className="w-full px-4 py-3 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Edit Form
          </button>
        </form>
      </div>
    </div>
  );
}; 