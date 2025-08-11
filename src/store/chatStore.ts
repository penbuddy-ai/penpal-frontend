/**
 * Chat store for managing chat state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ChatMessage,
  Conversation,
  DemoChatRequest,
  SupportedLanguage,
  LanguageLevel,
  ChatMode,
} from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { AIDemoService } from '@/services/ai-demo.service';

// Helper function pour serialiser/deserialiser les dates
const serializeDate = (date: Date): string => date.toISOString();
const deserializeDate = (dateString: string): Date => new Date(dateString);

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isTyping: boolean;
  // Demo AI settings
  demoSettings: {
    language: SupportedLanguage;
    level: LanguageLevel;
    mode: ChatMode;
  };
  // Error state
  error: string | null;
  // Demo limitations
  demoMessageCount: number;
  demoMessageLimit: number;

  // Actions
  getCurrentConversation: () => Conversation | undefined;
  getDemoConversations: () => Conversation[];
  getNormalConversations: () => Conversation[];
  setCurrentConversation: (conversationId: string) => void;
  createNewConversation: (language: string) => string;
  createNewDemoConversation: (language: string) => string;
  createNewNormalConversation: (language: string) => string;
  addMessage: (
    content: string,
    sender: 'user' | 'bot',
    options?: Partial<Omit<ChatMessage, 'id' | 'content' | 'sender' | 'timestamp'>>
  ) => void;
  setTypingStatus: (isTyping: boolean) => void;
  deleteConversation: (conversationId: string) => void;

  // Demo AI Actions
  sendDemoMessage: (message: string) => Promise<void>;
  sendNormalMessage: (message: string) => Promise<void>;
  updateDemoSettings: (settings: Partial<ChatState['demoSettings']>) => void;
  setError: (error: string | null) => void;
  resetDemoConversation: () => void;
  canSendDemoMessage: () => boolean;
  isCurrentConversationDemo: () => boolean;
}

// Créer des dates fixes pour éviter les problèmes d'hydratation
const now = new Date();

// Mock data for initial development - creating a demo conversation by default
const mockInitialConversation: Conversation = {
  id: uuidv4(),
  title: 'Conversation Démo',
  language: 'fr',
  messages: [
    {
      id: uuidv4(),
      content:
        "Bonjour ! Je suis Penpal, votre assistant linguistique IA. Essayez d'écrire quelque chose en anglais et je vous aiderai avec des corrections ! 😊",
      sender: 'bot',
      timestamp: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
  isDemoConversation: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [mockInitialConversation],
      currentConversationId: mockInitialConversation.id,
      isTyping: false,
      demoSettings: {
        language: 'English',
        level: 'intermediate',
        mode: 'tutor',
      },
      error: null,
      demoMessageCount: 0,
      demoMessageLimit: 5,

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((conv) => conv.id === currentConversationId);
      },

      getDemoConversations: () => {
        const { conversations } = get();
        return conversations.filter((conv) => conv.isDemoConversation === true);
      },

      getNormalConversations: () => {
        const { conversations } = get();
        return conversations.filter((conv) => !conv.isDemoConversation);
      },

      isCurrentConversationDemo: () => {
        const currentConv = get().getCurrentConversation();
        return currentConv?.isDemoConversation === true;
      },

      setCurrentConversation: (conversationId: string) => {
        const { conversations } = get();
        if (conversations.some((conv) => conv.id === conversationId)) {
          set({ currentConversationId: conversationId });
        }
      },

      createNewConversation: (language: string) => {
        // By default, create a normal conversation (for backward compatibility)
        return get().createNewNormalConversation(language);
      },

      createNewDemoConversation: (language: string) => {
        const currentTime = new Date();
        const newConversation: Conversation = {
          id: uuidv4(),
          title: `Démo ${currentTime.toLocaleDateString()}`,
          language,
          messages: [
            {
              id: uuidv4(),
              content: `Bonjour ! Je suis Penpal, votre assistant linguistique IA. Essayez d'écrire quelque chose en ${language === 'fr' ? 'anglais' : 'français'} et je vous aiderai avec des corrections ! 😊`,
              sender: 'bot',
              timestamp: currentTime,
            },
          ],
          createdAt: currentTime,
          updatedAt: currentTime,
          isDemoConversation: true,
        };

        set((state) => ({
          conversations: [...state.conversations, newConversation],
          currentConversationId: newConversation.id,
          demoMessageCount: 0, // Reset demo message count for new demo conversation
        }));

        return newConversation.id;
      },

      createNewNormalConversation: (language: string) => {
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
          isDemoConversation: false,
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

        // For normal conversations, simulate bot typing
        if (sender === 'user' && !get().isCurrentConversationDemo()) {
          set({ isTyping: true });

          // Mock bot response after a delay for normal conversations
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

      // Demo AI Actions
      canSendDemoMessage: () => {
        const { demoMessageCount, demoMessageLimit } = get();
        return demoMessageCount < demoMessageLimit;
      },

      sendDemoMessage: async (message: string) => {
        const {
          currentConversationId,
          demoSettings,
          demoMessageCount,
          demoMessageLimit,
          isCurrentConversationDemo,
        } = get();
        if (!currentConversationId || !isCurrentConversationDemo()) return;

        // Check message limit
        if (demoMessageCount >= demoMessageLimit) {
          set({
            error: `Limite de ${demoMessageLimit} messages atteinte pour la démo. Utilisez le bouton reset pour continuer.`,
          });
          return;
        }

        // Clear any existing error
        set({ error: null });

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: message,
          sender: 'user',
          timestamp: new Date(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === currentConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, userMessage],
                updatedAt: new Date(),
              };
            }
            return conv;
          }),
          isTyping: true,
          demoMessageCount: state.demoMessageCount + 1,
        }));

        try {
          // Prepare request for AI demo
          const request: DemoChatRequest = {
            message,
            language: demoSettings.language,
            level: demoSettings.level,
            mode: demoSettings.mode,
          };

          const response = await AIDemoService.sendMessage(request);

          if (!response.success || !response.data) {
            throw new Error(AIDemoService.getErrorMessage(response));
          }

          const { aiResponse, corrections } = response.data;

          // Add AI response message
          const aiMessage: ChatMessage = {
            id: uuidv4(),
            content: aiResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          // Store corrections in conversation metadata for MessageBubble access
          set((state) => ({
            conversations: state.conversations.map((conv) => {
              if (conv.id === currentConversationId) {
                const updatedConv = {
                  ...conv,
                  messages: [...conv.messages, aiMessage],
                  updatedAt: new Date(),
                };

                // Store corrections in conversation metadata
                if (corrections.hasErrors) {
                  (updatedConv as any).messageCorrections = {
                    [userMessage.id]: corrections,
                  };
                }

                return updatedConv;
              }
              return conv;
            }),
            isTyping: false,
          }));
        } catch (error) {
          console.error('Error sending demo message:', error);

          // Add error message
          const errorMessage: ChatMessage = {
            id: uuidv4(),
            content: `Désolé, une erreur s'est produite : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            sender: 'bot',
            timestamp: new Date(),
          };

          set((state) => ({
            conversations: state.conversations.map((conv) => {
              if (conv.id === currentConversationId) {
                return {
                  ...conv,
                  messages: [...conv.messages, errorMessage],
                  updatedAt: new Date(),
                };
              }
              return conv;
            }),
            isTyping: false,
            error: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
          }));
        }
      },

      sendNormalMessage: async (message: string) => {
        const { currentConversationId, isCurrentConversationDemo } = get();
        if (!currentConversationId || isCurrentConversationDemo()) return;

        // For normal conversations, just use the regular addMessage method
        get().addMessage(message, 'user');
      },

      updateDemoSettings: (settings: Partial<ChatState['demoSettings']>) => {
        set((state) => ({
          demoSettings: {
            ...state.demoSettings,
            ...settings,
          },
        }));
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetDemoConversation: () => {
        const { currentConversationId, isCurrentConversationDemo } = get();
        if (!currentConversationId || !isCurrentConversationDemo()) return;

        const currentTime = new Date();
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          content:
            "Bonjour ! Je suis Penpal, votre assistant linguistique IA. Essayez d'écrire quelque chose et je vous aiderai avec des corrections ! 😊",
          sender: 'bot',
          timestamp: currentTime,
        };

        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === currentConversationId) {
              return {
                ...conv,
                messages: [welcomeMessage],
                updatedAt: currentTime,
              };
            }
            return conv;
          }),
          demoMessageCount: 0,
          error: null,
        }));
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
