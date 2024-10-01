import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    retries: {
      runMode: 1,
      openMode: 1,
    },
  },
});
