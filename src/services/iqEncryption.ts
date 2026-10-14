export const IQ_ENCRYPTION = 'RSA-OAEP-256+A256GCM';
export const IQ_AAD = 'hilbi-iq:v1';

export type EncryptedIQRequest = {
  version: 1;
  algorithm: typeof IQ_ENCRYPTION;
  wrappedKey: string;
  iv: string;
  ciphertext: string;
};

function base64(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

export async function encryptIQMessage(message: string, signal: AbortSignal): Promise<EncryptedIQRequest> {
  signal.throwIfAborted();
  // HTTPS authenticates the public key and protects the streamed reply.
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  if (window.location.protocol !== 'https:' && !local) throw new Error('HTTPS is required.');
  if (!crypto.subtle) throw new Error('Web Crypto is unavailable.');
  const response = await fetch('/iq/key', {
    signal, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Encryption key unavailable.');
  const document: unknown = await response.json();
  if (!document || typeof document !== 'object' || !('algorithm' in document)
    || document.algorithm !== IQ_ENCRYPTION || !('publicKey' in document)
    || !document.publicKey || typeof document.publicKey !== 'object') throw new Error('Invalid encryption key.');
  const publicKey = await crypto.subtle.importKey('jwk', document.publicKey,
    { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  if ((publicKey.algorithm as RsaHashedKeyAlgorithm).modulusLength < 3072) throw new Error('Invalid encryption key.');
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({
    name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(IQ_AAD), tagLength: 128,
  }, key, new TextEncoder().encode(JSON.stringify({ message })));
  const rawKey = new Uint8Array(await crypto.subtle.exportKey('raw', key));
  let wrappedKey: ArrayBuffer;
  try {
    wrappedKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawKey);
  } finally {
    rawKey.fill(0);
  }
  signal.throwIfAborted();
  return { version: 1, algorithm: IQ_ENCRYPTION, wrappedKey: base64(wrappedKey), iv: base64(iv), ciphertext: base64(ciphertext) };
}
