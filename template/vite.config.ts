import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh is enabled by default
      // Babel options for better HMR if needed
      babel: {
        plugins: [],
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'dist-renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    // Enable HMR
    hmr: {
      overlay: true,
    },
    // Watch options for faster detection
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});


