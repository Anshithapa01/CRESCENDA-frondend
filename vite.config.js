import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     global: {}, // Define `global` for libraries expecting a Node.js environment
//   },
//   server: {
//     proxy: {
//       '/ws': {
//         target: 'http://localhost:5454',
//         ws: true, // Enable WebSocket proxying
//       },
//     },
//   },
// });

export default defineConfig({
  plugins: [react()],
  define: {
        global: {}, // Define `global` for libraries expecting a Node.js environment
      },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:5454',
        ws: true,
        changeOrigin: true
      },
      '/app': {
        target: 'http://localhost:5454',
        changeOrigin: true
      }
    }
  }
});
