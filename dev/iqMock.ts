import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { createIQEncryption } from './iqEncryption';
import { selectMedicalAnswer } from './medicalAnswers';

async function handleIQ(req: IncomingMessage, res: ServerResponse, encryption: ReturnType<typeof createIQEncryption>) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' }).end();
    return;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 32_000) {
        res.writeHead(413).end();
        return;
      }
      chunks.push(chunk);
    }
    const payload: unknown = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    const message = encryption.decrypt(payload);
    const tokens = message === '/demo empty' ? [] : selectMedicalAnswer(message).answer.match(/\S+\s*/gu) ?? [];
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const write = () => {
      if (res.destroyed) return;
      if (message === '/demo interrupted' && index === 12) {
        res.end();
        return;
      }
      if (index === tokens.length) {
        res.end(JSON.stringify({ type: 'done' }) + '\n');
        return;
      }
      res.write(JSON.stringify({ type: 'token', text: tokens[index++] }) + '\n');
      timer = setTimeout(write, message === '/demo slow' ? 350 : 35);
    };
    timer = setTimeout(() => {
      if (res.destroyed) return;
      if (message === '/demo error') {
        res.writeHead(503).end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store, no-transform',
        'X-Content-Type-Options': 'nosniff',
      });
      res.flushHeaders();
      write();
    // Emergency guidance should not wait behind the demonstration pause.
    }, message === '/demo waiting' ? 5_000 : [3, 4, 5, 6, 7].includes(selectMedicalAnswer(message).id) ? 0 : 2_000);
    res.on('close', () => clearTimeout(timer));
  } catch {
    if (!res.headersSent) res.writeHead(400);
    res.end();
  }
}

export function iqMock(): Plugin {
  const encryption = createIQEncryption();
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0];
    if (path === '/iq/key') {
      if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }).end(); return; }
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify(encryption.keyDocument));
      return;
    }
    if (path !== '/iq') return next();
    void handleIQ(req, res, encryption);
  };
  return {
    name: 'local-iq-mock',
    configureServer: (server) => { server.middlewares.use(middleware); },
    configurePreviewServer: (server) => { server.middlewares.use(middleware); },
  };
}
