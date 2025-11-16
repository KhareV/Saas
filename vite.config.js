import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './hero-3d.html'
      },
      output: {
        entryFileNames: 'hero-3d.js',
        assetFileNames: 'hero-3d.[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: '/hero-3d.html'
  },
  publicDir: 'public'
});
