import { IForm } from '../types/form.types';
import { simulateAPICall } from '../utils/apiSimulator';
import { StorageService, StorageKeys } from './storageService';

export const saveForm = async (form: IForm): Promise<void> => {
  return simulateAPICall(() => {
    StorageService.setItem(`${StorageKeys.PUBLISHED_FORM}${form.id}`, form);
  });
};

export const loadForm = async (formId: string): Promise<IForm | null> => {
  return simulateAPICall(() => {
    return StorageService.getItem(`${StorageKeys.PUBLISHED_FORM}${formId}`, null);
  });
}; 