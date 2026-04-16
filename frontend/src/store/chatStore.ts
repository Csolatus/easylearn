import { create } from "zustand";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatState = {
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  setConversationId: (id: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setLoading: (v: boolean) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  conversationId: null,
  messages: [],
  isLoading: false,

  setConversationId: (id) => set({ conversationId: id }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (v) => set({ isLoading: v }),
  reset: () => set({ conversationId: null, messages: [], isLoading: false }),
}));
