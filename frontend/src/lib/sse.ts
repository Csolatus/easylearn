import { useAuthStore } from "@/store/authStore";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type SseOptions = {
  onMessage: (data: string) => void;
  onError?: (err: Event) => void;
  onDone?: () => void;
};

/**
 * Ouvre un flux SSE vers `path` avec le token Bearer du store.
 * Retourne une fonction `close()` pour fermer la connexion.
 */
export function openSseStream(path: string, opts: SseOptions): () => void {
  const token = useAuthStore.getState().token;
  const url = new URL(`${BASE}${path}`);
  if (token) url.searchParams.set("token", token);

  const es = new EventSource(url.toString());

  es.onmessage = (e) => {
    if (e.data === "[DONE]") {
      opts.onDone?.();
      es.close();
    } else {
      opts.onMessage(e.data);
    }
  };

  es.onerror = (e) => {
    opts.onError?.(e);
    es.close();
  };

  return () => es.close();
}
