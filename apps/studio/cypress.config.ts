import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    retries: {
      runMode: 1,
      openMode: 1,
    },
  },
});
