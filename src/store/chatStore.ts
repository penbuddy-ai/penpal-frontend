/**
 * Chat store for managing chat state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatMessage, Conversation } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

// Helper function pour serialiser/deserialiser les dates
const serializeDate = (date: Date): string => date.toISOString();
const deserializeDate = (dateString: string): Date => new Date(dateString);

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isTyping: boolean;

  // Actions
  getCurrentConversation: () => Conversation | undefined;
  setCurrentConversation: (conversationId: string) => void;
  createNewConversation: (language: string) => string;
  addMessage: (
    content: string,
    sender: 'user' | 'bot',
    options?: Partial<Omit<ChatMessage, 'id' | 'content' | 'sender' | 'timestamp'>>
  ) => void;
  setTypingStatus: (isTyping: boolean) => void;
  deleteConversation: (conversationId: string) => void;
}

// Créer des dates fixes pour éviter les problèmes d'hydratation
const now = new Date();

// Mock data for initial development
const mockInitialConversation: Conversation = {
  id: uuidv4(),
  title: 'Première conversation',
  language: 'fr',
  messages: [
    {
      id: uuidv4(),
      content:
        "Bonjour ! Je suis Penpal, votre assistant linguistique. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [mockInitialConversation],
      currentConversationId: mockInitialConversation.id,
      isTyping: false,

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((conv) => conv.id === currentConversationId);
      },

      setCurrentConversation: (conversationId: string) => {
        const { conversations } = get();
        if (conversations.some((conv) => conv.id === conversationId)) {
          set({ currentConversationId: conversationId });
        }
      },

      createNewConversation: (language: string) => {
        const currentTime = new Date();
        const newConversation: Conversation = {
          id: uuidv4(),
          title: `Conversation ${currentTime.toLocaleDateString()}`,
          language,
          messages: [
            {
              id: uuidv4(),
              content: `Bonjour ! Je suis Penpal, votre assistant linguistique. Comment puis-je vous aider aujourd'hui ?`,
              sender: 'bot',
              timestamp: currentTime,
            },
          ],
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        set((state) => ({
          conversations: [...state.conversations, newConversation],
          currentConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      addMessage: (content, sender, options = {}) => {
        const { conversations, currentConversationId } = get();
        if (!currentConversationId) return;

        const currentTime = new Date();
        const newMessage: ChatMessage = {
          id: uuidv4(),
          content,
          sender,
          timestamp: currentTime,
          ...options,
        };

        const updatedConversations = conversations.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: currentTime,
            };
          }
          return conv;
        });

        set({ conversations: updatedConversations });

        // Simulate bot typing for development
        if (sender === 'user') {
          set({ isTyping: true });

          // Mock bot response after a delay
          setTimeout(() => {
            const responseTime = new Date();
            const botMessage: ChatMessage = {
              id: uuidv4(),
              content: `C'est une réponse simulée à "${content}"`,
              sender: 'bot',
              timestamp: responseTime,
            };

            set((state) => ({
              conversations: state.conversations.map((conv) => {
                if (conv.id === currentConversationId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, botMessage],
                    updatedAt: responseTime,
                  };
                }
                return conv;
              }),
              isTyping: false,
            }));
          }, 1500);
        }
      },

      setTypingStatus: (isTyping: boolean) => {
        set({ isTyping });
      },

      deleteConversation: (conversationId: string) => {
        const { conversations, currentConversationId } = get();

        const updatedConversations = conversations.filter((conv) => conv.id !== conversationId);

        // If the current conversation is deleted, set the first available conversation as current
        let newCurrentId = currentConversationId;
        if (conversationId === currentConversationId) {
          newCurrentId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
        }

        set({
          conversations: updatedConversations,
          currentConversationId: newCurrentId,
        });
      },
    }),
    {
      name: 'penpal-chat-storage',
      storage: createJSONStorage(() => localStorage),
      // Sérialisation personnalisée pour les dates
      partialize: (state) => ({
        ...state,
        conversations: state.conversations.map((conv) => ({
          ...conv,
          createdAt: serializeDate(conv.createdAt),
          updatedAt: serializeDate(conv.updatedAt),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: serializeDate(msg.timestamp),
          })),
        })),
      }),
      // Désérialisation des dates lors du chargement du store
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.conversations = state.conversations.map((conv) => ({
            ...conv,
            createdAt:
              typeof conv.createdAt === 'string' ? deserializeDate(conv.createdAt) : conv.createdAt,
            updatedAt:
              typeof conv.updatedAt === 'string' ? deserializeDate(conv.updatedAt) : conv.updatedAt,
            messages: conv.messages.map((msg) => ({
              ...msg,
              timestamp:
                typeof msg.timestamp === 'string' ? deserializeDate(msg.timestamp) : msg.timestamp,
            })),
          }));
        }
      },
    }
  )
);
