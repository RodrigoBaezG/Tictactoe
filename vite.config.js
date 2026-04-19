import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'Tictactoe';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
