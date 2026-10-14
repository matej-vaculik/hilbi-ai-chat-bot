import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ChatInput } from './ChatInput';

afterEach(cleanup);

it('sends with Enter, preserves Shift+Enter and IME composition, and retains unsent input', () => {
  const onSend = vi.fn().mockReturnValue(false);
  render(<ChatInput busy={false} onSend={onSend} onStop={vi.fn()} onPrivacy={vi.fn()} />);
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
  fireEvent.change(textarea, { target: { value: 'A question' } });
  fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
  fireEvent.compositionStart(textarea);
  fireEvent.keyDown(textarea, { key: 'Enter', isComposing: true });
  expect(onSend).not.toHaveBeenCalled();
  fireEvent.compositionEnd(textarea);
  fireEvent.keyDown(textarea, { key: 'Enter' });
  expect(onSend).toHaveBeenCalledWith('A question');
  expect(textarea.value).toBe('A question');
  onSend.mockReturnValue(true);
  fireEvent.keyDown(textarea, { key: 'Enter' });
  expect(textarea.value).toBe('');
  expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true);
});
