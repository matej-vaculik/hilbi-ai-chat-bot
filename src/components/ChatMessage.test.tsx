import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../hooks/useStreamingChat';

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('keeps existing text nodes stable while revealing newly received chunks', () => {
  const message: Message = { id: 'reply', role: 'assistant', content: 'First ', chunks: ['First '] };
  const props = { active: true, retryable: false, onRetry: vi.fn(), onWordFinished: vi.fn() };
  const { container, rerender } = render(<ChatMessage {...props} message={message} />);
  const firstChunk = container.querySelector('.stream-token');
  expect(container.querySelector('.stream-cursor')).toBeNull();
  expect(props.onWordFinished).not.toHaveBeenCalled();
  fireEvent.animationEnd(firstChunk!.firstElementChild!);
  expect(props.onWordFinished).not.toHaveBeenCalled();
  fireEvent.animationEnd(firstChunk!.lastElementChild!);
  expect(props.onWordFinished).toHaveBeenCalledWith('reply', 0);
  rerender(<ChatMessage {...props} message={{ ...message, content: 'First second', chunks: ['First ', 'second'] }} />);
  expect(container.querySelector('.stream-token')).toBe(firstChunk);
  expect(container.querySelectorAll('.stream-token')).toHaveLength(2);
  expect(container.querySelector('.message-visual')?.textContent).toBe('First second');
  expect(container.querySelector('.message-visual')?.getAttribute('aria-hidden')).toBe('true');
  expect(container.querySelector('.message-content .sr-only')?.textContent).toBe('First second');
  rerender(<ChatMessage {...props} active={false} message={{ ...message, content: 'First second', chunks: ['First ', 'second'], outcome: 'complete' }} />);
  expect(container.querySelector('.stream-token')).toBe(firstChunk);
  expect(container.querySelector('.stream-cursor')).toBeNull();
});

it('reveals complete Unicode characters and waits for the final character before advancing', () => {
  const onWordFinished = vi.fn();
  const text = 'A👩🏽‍💻e\u0301 ';
  const { container } = render(<ChatMessage active retryable={false} onRetry={vi.fn()} onWordFinished={onWordFinished}
    message={{ id: 'reply', role: 'assistant', content: text, chunks: [text] }} />);
  const letters = container.querySelectorAll('.stream-character');
  expect(Array.from(letters, (letter) => letter.textContent)).toEqual(['A', '👩🏽‍💻', 'e\u0301', ' ']);
  fireEvent.animationEnd(letters[1]);
  expect(onWordFinished).not.toHaveBeenCalled();
  fireEvent.animationEnd(letters[3]);
  expect(onWordFinished).toHaveBeenCalledWith('reply', 0);
});

it('advances without waiting for animation events when reduced motion is enabled', () => {
  vi.mocked(window.matchMedia).mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  const onWordFinished = vi.fn();
  render(<ChatMessage active retryable={false} onRetry={vi.fn()} onWordFinished={onWordFinished}
    message={{ id: 'reply', role: 'assistant', content: 'Hello ', chunks: ['Hello '] }} />);
  expect(onWordFinished).toHaveBeenCalledWith('reply', 0);
});
