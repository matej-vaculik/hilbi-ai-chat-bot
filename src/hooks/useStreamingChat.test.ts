import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useStreamingChat } from './useStreamingChat';

vi.mock('../services/iqEncryption', () => ({ encryptIQMessage: vi.fn(async () => ({ version: 1, ciphertext: 'encrypted-test-payload' })) }));

const encoder = new TextEncoder();

function pendingFetch() {
  let source!: ReadableStreamDefaultController<Uint8Array>;
  let signal!: AbortSignal;
  const fetch = vi.fn().mockImplementation((_url, options: RequestInit) => {
    signal = options.signal!;
    return Promise.resolve(new Response(new ReadableStream({
      start(controller) {
        source = controller;
        signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), { once: true });
      },
    }), { headers: { 'Content-Type': 'application/x-ndjson' } }));
  });
  vi.stubGlobal('fetch', fetch);
  return { fetch, get signal() { return signal; }, token: (text: string) => source.enqueue(encoder.encode(JSON.stringify({ type: 'token', text }) + '\n')),
    finish: () => { source.enqueue(encoder.encode('{"type":"done"}\n')); source.close(); },
    fail: () => source.error(new TypeError('Connection interrupted')) };
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('useStreamingChat', () => {
  it('prevents empty and duplicate messages while accepting personal details', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    act(() => {
      expect(result.current.send(' \n ')).toBe(false);
    });
    expect(result.current.messages).toEqual([]);
    act(() => {
      expect(result.current.send('Test user: demo@example.com, +420 777 123 456')).toBe(true);
      expect(result.current.send('Duplicate prompt')).toBe(false);
    });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledOnce());
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].content).toBe('Test user: demo@example.com, +420 777 123 456');
  });

  it('moves from loading to streaming to success incrementally', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    act(() => { result.current.send('Hello'); });
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(request.fetch).toHaveBeenCalledOnce());
    act(() => { request.token('First '); });
    await waitFor(() => expect(result.current.status).toBe('streaming'));
    expect(result.current.messages[1].content).toBe('First ');
    expect(result.current.messages[1].chunks).toEqual(['First ']);
    await act(async () => { request.token('second'); request.finish(); });
    expect(result.current.messages[1].content).toBe('First ');
    expect(result.current.busy).toBe(true);
    act(() => { result.current.finishWord(result.current.messages[1].id, 0); });
    expect(result.current.messages[1].content).toBe('First second');
    expect(result.current.status).toBe('streaming');
    act(() => { result.current.finishWord(result.current.messages[1].id, 1); });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.messages[1]).toMatchObject({ content: 'First second', outcome: 'complete' });
    expect(result.current.messages[1].chunks).toEqual(['First ', 'second']);
  });

  it('aborts and preserves the partial response, then accepts another message', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    act(() => { result.current.send('Hello'); });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledOnce());
    act(() => { request.token('Partial answer'); });
    await waitFor(() => expect(result.current.status).toBe('streaming'));
    act(() => { result.current.stop(); });
    await waitFor(() => expect(result.current.busy).toBe(false));
    expect(request.signal.aborted).toBe(true);
    expect(result.current.messages[1]).toMatchObject({ content: 'Partial ', outcome: 'cancelled' });
    act(() => { expect(result.current.send('Another question')).toBe(true); });
    expect(result.current.messages).toHaveLength(4);
  });

  it('retries an API failure without duplicating the user message', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(useStreamingChat);
    act(() => { result.current.send('Hello'); });
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.messages[0].content).toBe('Hello');
    act(() => { result.current.retry(); });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(result.current.messages).toHaveLength(2);
    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('clears previous streamed chunks before retrying an interrupted response', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    act(() => { result.current.send('Hello'); });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledOnce());
    act(() => { request.token('Partial '); });
    await waitFor(() => expect(result.current.status).toBe('streaming'));
    act(() => { request.fail(); });
    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => { result.current.retry(); });
    expect(result.current.messages[1]).toMatchObject({ content: '', chunks: [] });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledTimes(2));
    await act(async () => { request.token('Replacement'); request.finish(); });
    act(() => { result.current.finishWord(result.current.messages[1].id, 0); });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.messages[1]).toMatchObject({ content: 'Replacement', chunks: ['Replacement'] });
    expect(result.current.messages).toHaveLength(2);
  });

  it('aborts on unmount and resets a running conversation safely', async () => {
    const request = pendingFetch();
    const { result, unmount } = renderHook(useStreamingChat);
    act(() => { result.current.send('Hello'); });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledOnce());
    const firstSignal = request.signal;
    act(() => { result.current.clear(); });
    expect(firstSignal.aborted).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe('idle');
    act(() => { result.current.send('New question'); });
    await waitFor(() => expect(request.fetch).toHaveBeenCalledTimes(2));
    unmount();
    expect(request.signal.aborted).toBe(true);
  });

  it('shows a friendly network error while retaining the user message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const { result } = renderHook(useStreamingChat);
    act(() => { result.current.send('A safe question'); });
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.messages[0].content).toBe('A safe question');
    expect(result.current.messages[1].error).toContain('Check your connection');
  });

  it('joins split words and reveals only one word per finished animation', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    await act(async () => { result.current.send('Hello'); });
    await act(async () => { request.token('Hel'); });
    expect(result.current.messages[1].content).toBe('');
    await act(async () => { request.token('lo café\n\nThird'); request.finish(); });
    const id = result.current.messages[1].id;
    expect(result.current.messages[1].chunks).toEqual(['Hello ']);
    act(() => { result.current.finishWord('stale-response', 0); });
    expect(result.current.messages[1].content).toBe('Hello ');
    act(() => { result.current.finishWord(id, 0); });
    expect(result.current.messages[1].chunks).toEqual(['Hello ', 'café\n\n']);
    act(() => { result.current.finishWord(id, 0); });
    expect(result.current.messages[1].chunks).toHaveLength(2);
    act(() => { result.current.finishWord(id, 1); });
    expect(result.current.status).toBe('streaming');
    act(() => { result.current.finishWord(id, 2); });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.messages[1].content).toBe('Hello café\n\nThird');
  });

  it('stops queued words even after the network response has finished', async () => {
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    await act(async () => { result.current.send('Hello'); });
    await act(async () => { request.token('One two three'); request.finish(); });
    const id = result.current.messages[1].id;
    expect(result.current.messages[1].content).toBe('One ');
    await act(async () => { result.current.stop(); });
    act(() => { result.current.finishWord(id, 0); });
    expect(result.current.messages[1]).toMatchObject({ content: 'One ', outcome: 'cancelled' });
    expect(result.current.busy).toBe(false);
  });

  it('reveals large bursts immediately with reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const request = pendingFetch();
    const { result } = renderHook(useStreamingChat);
    const content = 'A word '.repeat(150) + 'End';
    await act(async () => { result.current.send('Hello'); });
    await act(async () => { request.token(content); request.finish(); });
    expect(result.current.messages[1].content).toBe(content);
    expect(result.current.status).toBe('success');
  });
});
