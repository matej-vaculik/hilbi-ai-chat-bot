// @vitest-environment node
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createIQEncryption } from '../../dev/iqEncryption';
import { encryptIQMessage } from './iqEncryption';
import { streamIQ } from './iqClient';

const server = createIQEncryption();
beforeEach(() => {
  vi.stubGlobal('window', { location: { protocol: 'https:', hostname: 'health.example' } });
  vi.stubGlobal('crypto', webcrypto);
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => {
    if (url !== '/iq/key') throw new Error('Unexpected endpoint');
    return Response.json(server.keyDocument);
  }));
});
afterEach(() => vi.unstubAllGlobals());

it('round-trips a maximum-length Unicode message without plaintext in the request', async () => {
  const message = 'A synthetic patient detail: café 🌿 '.padEnd(4000, 'é');
  const encrypted = await encryptIQMessage(message, new AbortController().signal);
  expect(JSON.stringify(encrypted)).not.toContain('synthetic');
  expect(encrypted).not.toHaveProperty('message');
  expect(server.decrypt(encrypted)).toBe(message);
});

it('generates a fresh key and IV for each message', async () => {
  const signal = new AbortController().signal;
  const first = await encryptIQMessage('The same message', signal);
  const second = await encryptIQMessage('The same message', signal);
  expect(first.iv).not.toBe(second.iv);
  expect(first.wrappedKey).not.toBe(second.wrappedKey);
  expect(first.ciphertext).not.toBe(second.ciphertext);
});

it('rejects tampering, plaintext, malformed envelopes, and oversized messages', async () => {
  const encrypted = await encryptIQMessage('A health question', new AbortController().signal);
  const bytes = Buffer.from(encrypted.ciphertext, 'base64');
  bytes[0] ^= 1;
  expect(() => server.decrypt({ ...encrypted, ciphertext: bytes.toString('base64') })).toThrow();
  expect(() => server.decrypt({ message: 'plaintext' })).toThrow();
  expect(() => server.decrypt({ ...encrypted, iv: 'bad' })).toThrow();
  expect(() => server.decrypt({ ...encrypted, version: 2 })).toThrow();
  const oversized = await encryptIQMessage('x'.repeat(4001), new AbortController().signal);
  expect(() => server.decrypt(oversized)).toThrow('Invalid message');
});

it('requires HTTPS for remote hosts and permits loopback development', async () => {
  vi.stubGlobal('window', { location: { protocol: 'http:', hostname: 'health.example' } });
  await expect(encryptIQMessage('Hello', new AbortController().signal)).rejects.toThrow('HTTPS');
  expect(fetch).not.toHaveBeenCalled();
  vi.stubGlobal('window', { location: { protocol: 'http:', hostname: '127.0.0.1' } });
  expect(server.decrypt(await encryptIQMessage('Hello', new AbortController().signal))).toBe('Hello');
});

it('fails closed when the key endpoint fails or returns an invalid key', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
  await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('was not sent');
  vi.mocked(fetch).mockResolvedValueOnce(Response.json({ algorithm: 'base64', publicKey: {} }));
  await expect(streamIQ('Hello', new AbortController().signal, vi.fn())).rejects.toThrow('was not sent');
  expect(vi.mocked(fetch).mock.calls.every(([url]) => url === '/iq/key')).toBe(true);
});

it('does not post if cancelled while retrieving the key', async () => {
  vi.mocked(fetch).mockImplementationOnce((_url, options) => new Promise((_resolve, reject) => {
    options?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }));
  const controller = new AbortController();
  const request = streamIQ('Hello', controller.signal, vi.fn());
  controller.abort();
  await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  expect(fetch).toHaveBeenCalledOnce();
});

it('integrates encryption and streaming while keeping the POST body confidential', async () => {
  const message = 'Test Patient: demo@example.com, +420 777 123 456. I have a headache';
  vi.mocked(fetch).mockImplementation(async (url, options) => {
    if (url === '/iq/key') return Response.json(server.keyDocument);
    expect(url).toBe('/iq');
    const body = options?.body as string;
    expect(body).not.toContain('headache');
    expect(body).not.toContain('demo@example.com');
    expect(body).not.toContain('+420 777 123 456');
    expect(server.decrypt(JSON.parse(body))).toBe(message);
    return new Response('{"type":"token","text":"Medical demo reply"}\n{"type":"done"}\n', {
      headers: { 'Content-Type': 'application/x-ndjson' },
    });
  });
  const onToken = vi.fn();
  await streamIQ(message, new AbortController().signal, onToken);
  expect(onToken).toHaveBeenCalledWith('Medical demo reply');
});
