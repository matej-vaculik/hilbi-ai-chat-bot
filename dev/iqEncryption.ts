import { constants, createDecipheriv, generateKeyPairSync, privateDecrypt } from 'node:crypto';
import { IQ_AAD, IQ_ENCRYPTION } from '../src/services/iqEncryption';

function decode(value: unknown): Buffer {
  if (typeof value !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error('Invalid encrypted request.');
  }
  return Buffer.from(value, 'base64');
}

/** Demo keys live only in server memory and are renewed on restart. */
export function createIQEncryption() {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 3072 });
  return {
    keyDocument: { algorithm: IQ_ENCRYPTION, publicKey: publicKey.export({ format: 'jwk' }) },
    decrypt(payload: unknown): string {
      if (!payload || typeof payload !== 'object' || !('version' in payload) || payload.version !== 1
        || !('algorithm' in payload) || payload.algorithm !== IQ_ENCRYPTION
        || !('wrappedKey' in payload) || !('iv' in payload) || !('ciphertext' in payload)) {
        throw new Error('Encrypted request required.');
      }
      const wrappedKey = decode(payload.wrappedKey);
      const iv = decode(payload.iv);
      const ciphertext = decode(payload.ciphertext);
      if (wrappedKey.length !== 384 || iv.length !== 12 || ciphertext.length < 17 || ciphertext.length > 24_000) {
        throw new Error('Invalid encrypted request.');
      }
      const key = privateDecrypt({ key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, wrappedKey);
      try {
        if (key.length !== 32) throw new Error('Invalid encryption key.');
        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAAD(Buffer.from(IQ_AAD));
        decipher.setAuthTag(ciphertext.subarray(-16));
        const plaintext = Buffer.concat([decipher.update(ciphertext.subarray(0, -16)), decipher.final()]);
        const document: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(plaintext));
        if (!document || typeof document !== 'object' || !('message' in document)
          || typeof document.message !== 'string' || !document.message.trim() || document.message.length > 4000) {
          throw new Error('Invalid message.');
        }
        return document.message.trim();
      } finally {
        key.fill(0);
      }
    },
  };
}
