import { IForm, IQuestion } from '../types/form.types';
import { validateQuestion } from '../utils/formValidators';

interface IFormStorageService {
  saveFormProgress: (form: IForm) => Promise<void>;
  savePublishedForm: (form: IForm) => Promise<void>;
  loadFormProgress: () => Promise<IForm | null>;
  loadPublishedForm: (formId: string) => Promise<IForm | null>;
}

class LocalStorageFormService implements IFormStorageService {
  private readonly PROGRESS_KEY = 'formProgress';
  private readonly PUBLISHED_KEY = 'publishedForm_';

  private filterValidQuestions(questions: IQuestion[]): IQuestion[] {
    return questions.filter(question => validateQuestion(question, true).isValid);
  }

  async saveFormProgress(form: IForm): Promise<void> {
    try {
      const validQuestions = this.filterValidQuestions(form.questions);
      const formToSave = { ...form, questions: validQuestions };
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(formToSave));
    } catch (error) {
      console.error('Failed to save form progress:', error);
      throw new Error('Failed to save form progress');
    }
  }

  async savePublishedForm(form: IForm): Promise<void> {
    try {
      localStorage.setItem(this.PUBLISHED_KEY + form.id, JSON.stringify(form));
    } catch (error) {
      console.error('Failed to save published form:', error);
      throw new Error('Failed to save published form');
    }
  }

  async loadFormProgress(): Promise<IForm | null> {
    try {
      const saved = localStorage.getItem(this.PROGRESS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load form progress:', error);
      throw new Error('Failed to load form progress');
    }
  }

  async loadPublishedForm(formId: string): Promise<IForm | null> {
    try {
      const saved = localStorage.getItem(this.PUBLISHED_KEY + formId);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load published form:', error);
      throw new Error('Failed to load published form');
    }
  }
}

// Export an instance of the service
export const formStorageService = new LocalStorageFormService(); 