export const StorageKeys = {
  FORM_PROGRESS: 'formProgress',
  PUBLISHED_FORM: 'publishedForm_',
  FORM_RESPONSE: 'formResponse_'
} as const;

export const StorageService = {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Failed to load from storage: ${key}`, error);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to storage: ${key}`, error);
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from storage: ${key}`, error);
    }
  }
}; 