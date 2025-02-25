export const API_CONFIG = {
  ERROR_RATE: 0.1,
  MIN_DELAY: 1000,
  MAX_DELAY: 3000
};

export const getRandomDelay = (): number => 
  Math.floor(Math.random() * (API_CONFIG.MAX_DELAY - API_CONFIG.MIN_DELAY)) + API_CONFIG.MIN_DELAY;

export const simulateAPICall = <T>(operation: () => T): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (Math.random() < API_CONFIG.ERROR_RATE) {
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