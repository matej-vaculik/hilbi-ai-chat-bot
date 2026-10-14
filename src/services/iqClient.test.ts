import { afterEach, describe, expect, it, vi } from 'vitest';
import { streamIQ } from './iqClient';
import { encryptIQMessage } from './iqEncryption';

// Stream parsing is tested separately from the real encryption round-trip.
vi.mock('./iqEncryption', () => ({ encryptIQMessage: vi.fn(async () => ({ version: 1, ciphertext: 'encrypted-test-payload' })) }));

const encoder = new TextEncoder();
const event = (text: string) => JSON.stringify({ type: 'token', text }) + '\n';
const done = '{"type":"done"}\n';

function response(chunks: Uint8Array[]) {
  return new Response(new ReadableStream({
    start(controller) { chunks.forEach((chunk) => controller.enqueue(chunk)); controller.close(); },
  }), { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' } });
}

afterEach(() => vi.unstubAllGlobals());

describe('/iq stream client', () => {
  it('blocks empty and oversized prompts before fetching', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    for (const input of ['', '  \n ', 'x'.repeat(4001)]) {
      await expect(streamIQ(input, new AbortController().signal, vi.fn())).rejects.toThrow();
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each(['demo@example.com', '+420 777 123 456', 'Test Patient, 42 Example Street'])(
    'accepts personal details and encrypts them without redaction: %s', async (message) => {
      const fetch = vi.fn().mockResolvedValue(response([encoder.encode(event('Demo reply') + done)]));
      vi.stubGlobal('fetch', fetch);
      await streamIQ(message, new AbortController().signal, vi.fn());
      expect(encryptIQMessage).toHaveBeenCalledWith(message, expect.any(AbortSignal));
      expect(fetch).toHaveBeenCalledWith('/iq', expect.objectContaining({ body: '{"version":1,"ciphertext":"encrypted-test-payload"}' }));
    },
  );

  it('receives incremental tokens before the stream completes', async () => {
    let controller!: ReadableStreamDefaultController<Uint8Array>;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ReadableStream({
      start(value) { controller = value; },
    }), { headers: { 'Content-Type': 'application/x-ndjson' } })));
    const onToken = vi.fn();
    let completed = false;
    const task = streamIQ('Explain something', new AbortController().signal, onToken).then(() => { completed = true; });
    controller.enqueue(encoder.encode(event('First ')));
    await vi.waitFor(() => expect(onToken).toHaveBeenCalledWith('First '));
    expect(completed).toBe(false);
    controller.enqueue(encoder.encode(event('second') + done));
    controller.close();
    await task;
    expect(onToken.mock.calls.map(([token]) => token)).toEqual(['First ', 'second']);
  });

  it('decodes split UTF-8 characters and split NDJSON records', async () => {
    const bytes = encoder.encode(event('café 🌿 — 你好') + event('\nSecond line') + done);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(Array.from(bytes, (byte) => new Uint8Array([byte])))));
    const onToken = vi.fn();
    await streamIQ('Hello', new AbortController().signal, onToken);
    expect(onToken.mock.calls.map(([token]) => token).join('')).toBe('café 🌿 — 你好\nSecond line');
  });

  it('sends the encrypted payload to /iq without credentials or referrer', async () => {
    const fetch = vi.fn().mockResolvedValue(response([encoder.encode(event('Hello') + done)]));
    vi.stubGlobal('fetch', fetch);
    await streamIQ('  Safe prompt  ', new AbortController().signal, vi.fn());
    expect(fetch).toHaveBeenCalledWith('/iq', expect.objectContaining({
      method: 'POST', body: '{"version":1,"ciphertext":"encrypted-test-payload"}', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
    }));
    expect(encryptIQMessage).toHaveBeenCalledWith('Safe prompt', expect.any(AbortSignal));
  });

  it('never posts a plaintext fallback when encryption fails', async () => {
    vi.mocked(encryptIQMessage).mockRejectedValueOnce(new Error('Unavailable'));
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await expect(streamIQ('Health question', new AbortController().signal, vi.fn())).rejects.toThrow('was not sent');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('could not respond');
  });

  it('rejects an empty response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([encoder.encode(event('  ') + done)])));
    await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('No response');
  });

  it('detects an interrupted stream and retains received tokens', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([encoder.encode(event('Partial'))])));
    const onToken = vi.fn();
    await expect(streamIQ('Hello', new AbortController().signal, onToken)).rejects.toThrow('before the response finished');
    expect(onToken).toHaveBeenCalledWith('Partial');
  });

  it('rejects unsupported formats and malformed events', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('text')).mockResolvedValueOnce(response([encoder.encode('invalid\n')]));
    vi.stubGlobal('fetch', fetch);
    await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('unsupported');
    await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('could not be read');
  });

  it('cancels the reader when the request is aborted', async () => {
    const abort = new AbortController();
    const cancel = vi.fn();
    let controller!: ReadableStreamDefaultController<Uint8Array>;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ReadableStream({
      start(value) { controller = value; }, cancel,
    }), { headers: { 'Content-Type': 'application/x-ndjson' } })));
    const task = streamIQ('Hello', abort.signal, () => { abort.abort(); });
    controller.enqueue(encoder.encode(event('A token')));
    await expect(task).rejects.toMatchObject({ name: 'AbortError' });
    expect(cancel).toHaveBeenCalledOnce();
  });
});
