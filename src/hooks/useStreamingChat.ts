import { useCallback, useEffect, useRef, useState } from 'react';
import { IQError, streamIQ } from '../services/iqClient';

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'success' | 'error';
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chunks?: string[];
  outcome?: 'complete' | 'cancelled' | 'error';
  error?: string;
};

export function useStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const controller = useRef<AbortController | null>(null);
  const reveal = useRef<{ id: string; finish: (index: number) => void } | null>(null);
  const retryRequest = useRef<{ message: string; assistantId: string } | null>(null);

  useEffect(() => () => {
    const active = controller.current;
    controller.current = null;
    reveal.current = null;
    active?.abort();
  }, []);

  async function run(message: string, assistantId: string) {
    const request = new AbortController();
    controller.current = request;
    setStatus('loading');
    const update = (patch: Partial<Message>) => setMessages((previous) => previous.map(
      (item) => item.id === assistantId ? { ...item, ...patch } : item,
    ));

    let buffer = '';
    const words: string[] = [];
    let animating = false;
    let finished = false;
    let visibleIndex = -1;
    let resolveReveal: () => void = () => {};
    const revealed = new Promise<void>((resolve) => { resolveReveal = resolve; });
    const showNext = () => {
      if (request.signal.aborted || controller.current !== request || animating) return;
      if (words.length === 0) {
        if (finished) resolveReveal();
        return;
      }
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const nextWords = words.splice(0, reducedMotion ? words.length : 1);
      animating = !reducedMotion;
      visibleIndex += nextWords.length;
      setStatus('streaming');
      setMessages((previous) => previous.map((item) => item.id === assistantId
        ? { ...item, content: item.content + nextWords.join(''), chunks: [...(item.chunks ?? []), ...nextWords] }
        : item));
      if (reducedMotion && finished) resolveReveal();
    };
    reveal.current = { id: assistantId, finish: (index) => {
      if (!animating || index !== visibleIndex) return;
      animating = false;
      showNext();
    } };
    const abortReveal = () => {
      words.length = 0;
      resolveReveal();
    };
    request.signal.addEventListener('abort', abortReveal, { once: true });

    try {
      await streamIQ(message, request.signal, (token) => {
        if (controller.current !== request) return;
        buffer += token;
        let word: RegExpExecArray | null;
        while ((word = /^\s*\S+\s+/u.exec(buffer))) {
          words.push(word[0]);
          buffer = buffer.slice(word[0].length);
        }
        showNext();
      });
      if (controller.current !== request) return;
      if (buffer) words.push(buffer);
      finished = true;
      showNext();
      await revealed;
      request.signal.throwIfAborted();
      if (controller.current !== request) return;
      update({ outcome: 'complete' });
      setStatus('success');
      retryRequest.current = null;
    } catch (error) {
      if (controller.current !== request) return;
      if (request.signal.aborted) {
        update({ outcome: 'cancelled' });
        setStatus('idle');
      } else {
        update({ outcome: 'error', error: error instanceof IQError
          ? error.message
          : 'Could not connect to the assistant. Check your connection and try again.' });
        setStatus('error');
      }
    } finally {
      request.signal.removeEventListener('abort', abortReveal);
      if (controller.current === request) {
        controller.current = null;
        reveal.current = null;
      }
    }
  }

  function send(input: string): boolean {
    const message = input.trim();
    if (controller.current || !message) return false;
    const assistantId = crypto.randomUUID();
    retryRequest.current = { message, assistantId };
    setMessages((previous) => [...previous,
      { id: crypto.randomUUID(), role: 'user', content: message },
      { id: assistantId, role: 'assistant', content: '', chunks: [] },
    ]);
    void run(message, assistantId);
    return true;
  }

  function retry() {
    const last = retryRequest.current;
    if (!last || controller.current) return;
    setMessages((previous) => previous.map((item) => item.id === last.assistantId
      ? { ...item, content: '', chunks: [], outcome: undefined, error: undefined }
      : item));
    void run(last.message, last.assistantId);
  }

  function clear() {
    const active = controller.current;
    controller.current = null;
    reveal.current = null;
    active?.abort();
    retryRequest.current = null;
    setMessages([]);
    setStatus('idle');
  }

  const finishWord = useCallback((id: string, index: number) => {
    if (reveal.current?.id === id) reveal.current.finish(index);
  }, []);

  return {
    messages, status, send, retry, clear,
    finishWord,
    stop: () => controller.current?.abort(),
    busy: status === 'loading' || status === 'streaming',
  };
}
