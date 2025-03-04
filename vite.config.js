import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
        global: {}, // Define `global` for libraries expecting a Node.js environment
      },
  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true
  }
});
