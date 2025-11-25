
export enum Language {
  EN = 'en',
  HI = 'hi',
  MR = 'mr', // Marathi
  GU = 'gu', // Gujarati
  TA = 'ta', // Tamil
  TE = 'te', // Telugu
  KN = 'kn', // Kannada
  BN = 'bn', // Bengali
}

export interface User {
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FraudAnalysisResult {
  isFraud: boolean;
  riskScore: number; // 0-100
  explanation: string;
  advice: string;
}

export interface LoanPredictionResult {
  eligibilityScore: number; // 0-100
  status: 'High' | 'Medium' | 'Low';
  reasoning: string;
  tips: string[];
}

export type NavSection = 'dashboard' | 'emi' | 'loan' | 'expense' | 'fraud' | 'chat' | 'transfer' | 'insurance' | 'credit';
