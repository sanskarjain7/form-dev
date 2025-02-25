import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IForm } from '../types/form.types';
import { loadForm } from '../services/formService';
import { QuestionInput } from '../components/form-renderer/QuestionInput';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useFormResponseAutosave } from '../hooks/useFormResponseAutosave';
import toast from 'react-hot-toast';

interface FormResponse {
  [questionId: string]: string;
}

export const FormRenderer = () => {
  const { formId } = useParams();
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  
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
  
  // Use autosave hook
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
    
    const submitPromise = new Promise((resolve) => {
      // Your submission logic here
      // For now, just simulating success
      setTimeout(resolve, 1000);
    });

    toast.promise(submitPromise, {
      loading: 'Submitting responses...',
      success: 'Responses submitted successfully!',
      error: 'Failed to submit responses'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return <div className="text-center p-4">Form not found</div>;

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
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}; 