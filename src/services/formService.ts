import { IForm } from '../types/form.types';

export const saveForm = async (form: IForm): Promise<void> => {
  try {
    localStorage.setItem(`publishedForm_${form.id}`, JSON.stringify(form));
  } catch (error) {
    throw new Error(`Failed to save form: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const loadForm = async (formId: string): Promise<IForm | null> => {
  try {
    const savedForm = localStorage.getItem(`publishedForm_${formId}`);
    return savedForm ? JSON.parse(savedForm) : null;
  } catch (error) {
    throw new Error(`Failed to load form: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 