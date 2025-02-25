import { useNavigate } from 'react-router-dom';
import { IForm } from '../types/form.types';
import { validateForm } from '../utils/formValidators';
import { saveForm } from '../services/formService';
import toast from 'react-hot-toast';
import { confirmDialog } from '../components/common/confirmDialog';

export const usePublishForm = (
  form: IForm,
  setActiveQuestionId: (id: string | null) => void
) => {
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!form.title.trim()) {
      toast.error('Please add a form title');
      return;
    }
    if (form.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const { isValid, firstErrorIndex } = validateForm(form, true);
    
    if (!isValid) {
      const errorQuestion = form.questions[firstErrorIndex];
      setActiveQuestionId(errorQuestion.id);
      const element = document.getElementById(`question-${errorQuestion.id}`);
      element?.scrollIntoView({ behavior: 'smooth' });
      toast.error('Please fix validation errors before publishing');
      return;
    }

    const confirmed = await confirmDialog('Are you sure you want to publish this form?');
    if (!confirmed) return;

    const publishPromise = saveForm(form)
      .then(() => {
        navigate(`/form/${form.id}`);
      });

    toast.promise(publishPromise, {
      loading: 'Publishing form...',
      success: 'Form published successfully!',
      error: 'Failed to publish form'
    });
  };

  return { handlePublish };
}; 