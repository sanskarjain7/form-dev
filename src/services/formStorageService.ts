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
  private readonly ERROR_RATE = 0.1; // 10% chance of error
  
  private getRandomDelay(): number {
    return Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
  }

  private simulateAPICall<T>(operation: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Randomly throw error
          if (Math.random() < this.ERROR_RATE) {
            throw new Error('Network error occurred');
          }
          const result = operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, this.getRandomDelay());
    });
  }

  private filterValidQuestions(questions: IQuestion[]): IQuestion[] {
    return questions.filter(question => validateQuestion(question, true).isValid);
  }

  async saveFormProgress(form: IForm): Promise<void> {
    return this.simulateAPICall(() => {
      const validQuestions = this.filterValidQuestions(form.questions);
      const formToSave = { ...form, questions: validQuestions };
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(formToSave));
    });
  }

  async savePublishedForm(form: IForm): Promise<void> {
    return this.simulateAPICall(() => {
      localStorage.setItem(this.PUBLISHED_KEY + form.id, JSON.stringify(form));
    });
  }

  async loadFormProgress(): Promise<IForm | null> {
    return this.simulateAPICall(() => {
      const saved = localStorage.getItem(this.PROGRESS_KEY);
      return saved ? JSON.parse(saved) : null;
    });
  }

  async loadPublishedForm(formId: string): Promise<IForm | null> {
    return this.simulateAPICall(() => {
      const saved = localStorage.getItem(this.PUBLISHED_KEY + formId);
      return saved ? JSON.parse(saved) : null;
    });
  }
}

// Export an instance of the service
export const formStorageService = new LocalStorageFormService(); 