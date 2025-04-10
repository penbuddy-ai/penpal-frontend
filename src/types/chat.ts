/**
 * Types for chat functionality
 */

export type MessageSender = 'user' | 'bot';

export type CorrectionType = 'grammar' | 'vocabulary' | 'pronunciation' | 'syntax';

export interface Correction {
  originalText: string;
  correctedText: string;
  explanation: string;
  type: CorrectionType;
}

export interface Suggestion {
  text: string;
  context?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  corrections?: Correction[];
  suggestions?: Suggestion[];
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  language: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
