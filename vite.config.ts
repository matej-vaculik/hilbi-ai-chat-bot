import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { iqMock } from './dev/iqMock';

export default defineConfig({
  plugins: [react(), ...(process.env.IQ_MOCK === 'false' ? [] : [iqMock()])],
  define: { 'import.meta.env.VITE_IQ_MOCK': JSON.stringify(process.env.IQ_MOCK === 'false' ? 'false' : 'true') },
  test: { environment: 'jsdom', clearMocks: true },
});
