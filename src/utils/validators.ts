import { RangeValue } from "../types/form.types";

export const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateURL = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const validateContains = (value: string, searchText: string): boolean => {
  return value.toLowerCase().includes(searchText.toLowerCase());
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateGreaterThan = (value: number, threshold: number): boolean => {
  return value > threshold;
};

export const validateLessThan = (value: number, threshold: number): boolean => {
  return value < threshold;
};

export const validateRange = (value: number, range: RangeValue): boolean => {
  if (range.min === null || range.max === null) return true;
  return value >= range.min && value <= range.max;
};
