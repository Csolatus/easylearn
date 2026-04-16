"use client";

import { useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { api } from "@/lib/api";

export function useChat(studentId: string) {
  const { conversationId, messages, isLoading, setConversationId, addMessage, setLoading, reset } =
    useChatStore();

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    setLoading(true);
    addMessage({ role: "user", content: message });
    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await api.agent.createConversation(studentId);
        convId = conv.conversation_id;
        setConversationId(convId);
      }
      const res = await api.agent.chat(convId, studentId, message);
      addMessage({ role: "assistant", content: res.response });
    } catch (e) {
      addMessage({
        role: "assistant",
        content: e instanceof Error ? e.message : "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  }, [conversationId, studentId, setConversationId, addMessage, setLoading]);

  return { messages, isLoading, sendMessage, reset };
}
