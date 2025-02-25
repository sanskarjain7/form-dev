import { FormHeader } from '../components/form-builder/FormHeader';
import { QuestionCard } from '../components/form-builder/QuestionCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from '../hooks/useForm';
import { usePublishForm } from '../hooks/usePublishForm';

export const FormBuilder = () => {
  const {
    form,
    activeQuestionId,
    setActiveQuestionId,
    handleTitleChange,
    handleDescriptionChange,
    handleQuestionChange,
    handleQuestionDelete,
    handleAddQuestion
  } = useForm();
  
  const { handlePublish } = usePublishForm(form, setActiveQuestionId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <FormHeader 
            title={form.title}
            description={form.description}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
          />
        </div>

        <div className="space-y-6">
          {form.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onQuestionChange={handleQuestionChange}
              onQuestionDelete={() => handleQuestionDelete(question.id)}
              isActive={question.id === activeQuestionId}
            />
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Question
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Publish Form
          </button>
        </div>
      </div>
    </div>
  );
}; 