import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
      '.json',
    ],
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
    },
    include: ['react-native-web'],
  },
  server: {
    port: 5173,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-native-web'],
          router: ['react-router-dom'],
          virtual: ['@tanstack/react-virtual'],
        },
      },
    },
  },
});
