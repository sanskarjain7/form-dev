import { IForm } from '../types/form.types';

const ERROR_RATE = 0.1; // 10% chance of error
const getRandomDelay = () => Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

const simulateAPICall = <T>(operation: () => T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (Math.random() < ERROR_RATE) {
          throw new Error('Network error occurred');
        }
        const result = operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, getRandomDelay());
  });
};

export const saveForm = async (form: IForm): Promise<void> => {
  return simulateAPICall(() => {
    localStorage.setItem(`publishedForm_${form.id}`, JSON.stringify(form));
  });
};

export const loadForm = async (formId: string): Promise<IForm | null> => {
  return simulateAPICall(() => {
    const savedForm = localStorage.getItem(`publishedForm_${formId}`);
    return savedForm ? JSON.parse(savedForm) : null;
  });
}; 