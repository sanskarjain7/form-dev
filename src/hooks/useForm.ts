import { useState } from 'react';
import { IForm, IQuestion, QuestionType } from '../types/form.types';
import { validateQuestion } from '../services/validationService';
import { useFormAutosave } from './useFormAutosave';
import { StorageService, StorageKeys } from '../services/storageService';
import toast from 'react-hot-toast';

export const useForm = () => {
  const [form, setForm] = useState<IForm>(() => 
    StorageService.getItem(StorageKeys.FORM_PROGRESS, {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      questions: []
    })
  );
  
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const { saveProgress } = useFormAutosave(form);

  const handleAddQuestion = () => {
    // Check if any existing questions have errors
    for (const question of form.questions) {
      const { isValid, errors } = validateQuestion(question, true);
      if (!isValid) {
        const errorQuestion = question;
        setActiveQuestionId(errorQuestion.id);
        const element = document.getElementById(`question-${errorQuestion.id}`);
        element?.scrollIntoView({ behavior: 'smooth' });
        toast.error(errors.join('\n'));
        return;
      }
    }

    saveProgress();

    const newQuestion: IQuestion = {
      id: crypto.randomUUID(),
      type: QuestionType.Text,
      title: '',
      required: false
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestionId(newQuestion.id);
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({ ...prev, title }));
  };

  const handleDescriptionChange = (description: string) => {
    setForm(prev => ({ ...prev, description }));
  };

  const handleQuestionChange = (updatedQuestion: IQuestion) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    }));
    setActiveQuestionId(updatedQuestion.id);
  };

  const handleQuestionDelete = (questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  return {
    form,
    activeQuestionId,
    setActiveQuestionId,
    handleTitleChange,
    handleDescriptionChange,
    handleQuestionChange,
    handleQuestionDelete,
    handleAddQuestion,
    saveProgress
  };
}; 