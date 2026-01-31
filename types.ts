
export type ExpertRole = 'Doctor' | 'Lawyer' | 'Financial Advisor' | 'Mentor' | 'Fitness Coach' | 'Handyman';

export interface ExpertConfig {
  role: ExpertRole;
  icon: string;
  color: string;
  bgColor: string;
  orientationQuestion: string;
  systemInstruction: string;
  description: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  id: string;
}

export interface ChatState {
  activeExpert: ExpertRole | null;
  messages: Message[];
  isTyping: boolean;
}
