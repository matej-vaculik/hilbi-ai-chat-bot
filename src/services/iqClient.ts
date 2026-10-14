import { encryptIQMessage } from './iqEncryption';

export class IQError extends Error {}

type StreamEvent = { type: 'token'; text: string } | { type: 'done' };

function parseEvent(line: string): StreamEvent {
  let event: unknown;
  try {
    event = JSON.parse(line);
  } catch {
    throw new IQError('The response could not be read. Please try again.');
  }
  if (typeof event !== 'object' || event === null || !('type' in event)) {
    throw new IQError('The server returned an unexpected response. Please try again.');
  }
  if (event.type === 'done') return { type: 'done' };
  if (event.type === 'token' && 'text' in event && typeof event.text === 'string') {
    return { type: 'token', text: event.text };
  }
  throw new IQError('The server returned an unexpected response. Please try again.');
}

export async function streamIQ(
  message: string,
  signal: AbortSignal,
  onToken: (text: string) => void,
): Promise<void> {
  const trimmed = message.trim();
  if (!trimmed) throw new IQError('Write a message before sending.');
  if (trimmed.length > 4000) throw new IQError('Keep your message within 4,000 characters.');
  let payload;
  try {
    payload = await encryptIQMessage(trimmed, signal);
  } catch (error) {
    if (signal.aborted) throw error;
    throw new IQError('A secure connection could not be prepared. Your message was not sent. Please try again.');
  }

  const response = await fetch('/iq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson' },
    body: JSON.stringify(payload),
    signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    cache: 'no-store',
  });
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new IQError(response.status === 429
      ? 'The assistant is busy. Give it a moment, then try again.'
      : 'The assistant could not respond right now. Please try again.');
  }
  if (!response.headers.get('content-type')?.includes('application/x-ndjson') || !response.body) {
    await response.body?.cancel().catch(() => undefined);
    throw new IQError('The server returned an unsupported response format.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let buffer = '';
  let content = '';
  let completed = false;

  const consume = (line: string) => {
    signal.throwIfAborted();
    if (!line.trim()) return;
    const event = parseEvent(line);
    if (event.type === 'done') completed = true;
    else {
      content += event.text;
      onToken(event.text);
    }
  };

  try {
    while (!completed) {
      signal.throwIfAborted();
      const { value, done } = await reader.read();
      signal.throwIfAborted();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let newline: number;
      while (!completed && (newline = buffer.indexOf('\n')) >= 0) {
        consume(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
      }
      if (done) {
        if (!completed && buffer.trim()) consume(buffer);
        break;
      }
      if (buffer.length > 100_000) throw new IQError('The response could not be read. Please try again.');
    }
    if (!completed) throw new IQError('The connection ended before the response finished. Please try again.');
    if (!content.trim()) throw new IQError('No response was generated. Try again or rephrase your message.');
  } catch (error) {
    if (signal.aborted || error instanceof IQError) throw error;
    throw new IQError('The connection was interrupted. Please try again.');
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
