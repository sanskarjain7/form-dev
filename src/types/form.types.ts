export interface IOption {
  text: string;
  value: string;
}

export interface OptionsListProps {
  options: IOption[];
  onOptionAdd: (option: IOption) => void;
  onOptionChange: (index: number, option: IOption) => void;
  onOptionDelete: (index: number) => void;
}

export enum QuestionType {
  Text = 'text',
  Number = 'number',
  Dropdown = 'dropdown'
}

export enum TextValidation {
  None = 'none',
  Email = 'email',
  URL = 'url',
  Contains = 'contains',
  MinLength = 'minLength',
  MaxLength = 'maxLength'
}

export enum NumberValidation {
  None = 'none',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  Range = 'range'
}

export interface RangeValue {
  min: number | null;
  max: number | null;
}

export interface ValidationRule {
  type: TextValidation | NumberValidation;
  value?: string | number | RangeValue;
  message?: string;
}

export interface IQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: IOption[];
  validation?: ValidationRule;
  description?: string;
}

export interface IForm {
  id: string;
  title: string;
  description?: string;
  questions: IQuestion[];
}

export interface FormHeaderProps {
  title: string;
  description?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export interface QuestionCardProps {
  question: IQuestion;
  onQuestionChange: (updatedQuestion: IQuestion) => void;
  onQuestionDelete: () => void;
  isActive: boolean;
}

export interface QuestionToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onLink: () => void;
  onClear: () => void;
}

export interface MainToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onSettings: () => void;
  onShare: () => void;
}

export interface QuestionToolsProps {
  onAddQuestion: (type: QuestionType) => void;
  onImportQuestions: () => void;
}

export interface FormResponse {
  [questionId: string]: string;
}

export interface ValidationState {
  isValid: boolean;
  message: string;
}