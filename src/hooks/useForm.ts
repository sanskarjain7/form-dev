import { useState, useEffect } from 'react';
import { IForm, IQuestion, QuestionType } from '../types/form.types';
import { validateQuestion } from '../utils/formValidators';
import { useFormAutosave } from './useFormAutosave';
import { formStorageService } from '../services/formStorageService';
import toast from 'react-hot-toast';

export const useForm = () => {
  // Load initial state from localStorage
  const loadInitialForm = (): IForm => {
    try {
      const savedProgress = localStorage.getItem('formProgress');
      if (savedProgress) {
        return JSON.parse(savedProgress);
      }
    } catch (error) {
      console.error('Failed to load initial form:', error);
    }
    // Return default form if no saved progress or error
    return {
      id: '1',
      title: '',
      description: '',
      questions: []
    };
  };

  const [form, setForm] = useState<IForm>(loadInitialForm());
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const { saveProgress } = useFormAutosave(form);

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        const savedForm = await formStorageService.loadFormProgress();
        if (savedForm) {
          setForm(savedForm);
        }
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    };

    loadSavedProgress();
  }, []);

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

    // Save progress before adding new question
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