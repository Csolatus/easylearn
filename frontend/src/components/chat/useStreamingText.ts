import { useCallback, useRef } from "react";

type StreamOptions = {
  text: string;
  onToken: (char: string) => void;
  onDone: () => void;
  delayMs?: number;
};

export function useStreamingText() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(({ text, onToken, onDone, delayMs = 18 }: StreamOptions) => {
    // Cancel any ongoing stream
    if (intervalRef.current) clearInterval(intervalRef.current);

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onDone();
        return;
      }
      onToken(text[i]);
      i++;
    }, delayMs);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { start, stop };
}
