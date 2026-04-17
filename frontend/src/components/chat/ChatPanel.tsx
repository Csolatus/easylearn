"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api, ApiError } from "@/lib/api";
import { fetchStream } from "@/lib/sse";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const QUICK_SUGGESTIONS = [
  "Explique-moi les closures",
  "C'est quoi une higher-order function ?",
  "Donne-moi un exemple de mémoïsation",
  "Comment fonctionne async/await ?",
];

type Props = {
  isOpen: boolean;
};

export default function ChatPanel({ isOpen }: Props) {
  const user = useAuthStore((s) => s.user);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Bonjour ! Je suis ton assistant IA. Comment puis-je t'aider dans ton apprentissage ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming || !user) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await api.agent.createConversation(user.id);
        convId = conv.conversation_id;
        setConversationId(convId);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      await fetchStream(
        `/agent/conversations/${convId}/stream`,
        { student_id: user.id, message: text.trim() },
        {
          signal: controller.signal,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            );
          },
          onDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, streaming: false } : m
              )
            );
            setIsStreaming(false);
          },
          onError: (err) => {
            if (err.name === "AbortError") return;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: err.message || "Une erreur est survenue.", streaming: false }
                  : m
              )
            );
            setIsStreaming(false);
          },
        }
      );
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 503
          ? "L'agent IA est indisponible. Vérifiez qu'Ollama est démarré."
          : err instanceof Error
          ? err.message
          : "Une erreur est survenue.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: message, streaming: false } : m
        )
      );
      setIsStreaming(false);
    }
  }, [isStreaming, user, conversationId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 w-80 sm:w-96 flex flex-col rounded-2xl border border-border bg-surface shadow-2xl transition-all duration-300 origin-bottom-right ${
        isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
      }`}
      style={{ maxHeight: "70vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm shrink-0">
          ✦
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Assistant IA</p>
          <p className="text-xs text-gray-500">
            {isStreaming ? (
              <span className="text-purple-400 animate-pulse">En train de répondre...</span>
            ) : (
              "En ligne"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-white/10 dark:bg-gray-100 text-gray-200 dark:text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
              {msg.streaming && (
                <span className="inline-block w-1 h-3.5 bg-purple-400 ml-0.5 animate-pulse rounded-sm align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && !isStreaming && (
        <div className="px-4 pb-2 flex flex-col gap-1.5 shrink-0">
          <p className="text-xs text-gray-500 mb-0.5">Suggestions</p>
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-left text-xs px-3 py-2 rounded-xl border border-border text-gray-400 dark:text-gray-600 hover:bg-surface hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-border flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pose ta question..."
          disabled={isStreaming}
          className="flex-1 bg-white/5 dark:bg-gray-100 border border-white/10 dark:border-gray-300 text-foreground placeholder-gray-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shrink-0"
          aria-label="Envoyer le message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
