import { defineConfig } from 'vitest/config';
import path from 'path';

const config = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['config.ts', './tests/setup.ts'],
    isolate: true,
    env: {
      "NODE_ENV": 'development'
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});

export default config;
