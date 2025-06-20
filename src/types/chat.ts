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
  messageCorrections?: Record<string, MessageCorrections>; // Store corrections by message ID
}

// Demo AI Integration Types
export type LanguageLevel = 'beginner' | 'intermediate' | 'advanced';
export type ChatMode = 'tutor' | 'conversation-partner';
export type SupportedLanguage = 'English' | 'French' | 'Spanish';

export interface DemoChatRequest {
  message: string;
  language?: SupportedLanguage;
  level?: LanguageLevel;
  mode?: ChatMode;
}

export interface MessageCorrections {
  hasErrors: boolean;
  correctedText: string;
  errors: string[];
  explanation: string;
}

export interface ConversationContext {
  language: SupportedLanguage;
  level: LanguageLevel;
  mode: ChatMode;
}

export interface DemoChatResponse {
  success: boolean;
  data?: {
    userMessage: string;
    corrections: MessageCorrections;
    aiResponse: string;
    conversationContext: ConversationContext;
  };
  timestamp: string;
  error?: {
    message: string;
    details: string;
  };
}
