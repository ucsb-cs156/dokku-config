import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
 base: '/dokku-config/main', // Ensures that the app works correctly when served from a subdirectory
 plugins: [
    react(),
    process.env.ANALYZE && visualizer({ open: true }), // use `ANALYZE=true npm run build` to analyze the bundle size 
  ].filter(Boolean), // .filter(Boolean) removes any falsey values from the array
  build: {
    outDir: 'build', // Changes the output directory from 'dist' to 'build'
    chunkSizeWarningLimit: 512, // You can set this to a reasonable number slightly above your current chunk size
    // Vite 8 uses Rolldown; `rollupOptions` was renamed to `rolldownOptions`
    rolldownOptions: {
      output: {
        // Rolldown's replacement for the (deprecated) `manualChunks` function:
        // put everything from node_modules into a single "vendor" chunk
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
            },
          ],
        },
      },
    },
  },
  test: {
    globals: true, // makes describe, it, expect available globally
    environment: 'jsdom', // makes it possible to use DOM APIs
    setupFiles: './vitest.setup.js',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      enabled: true, // This enables coverage collection, equivalent to `check-coverage`
      provider: 'v8', // Recommended for performance, but you can also use 'istanbul'
      include: ['src/main/**'],
      thresholds: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100,
      },
      reporter: [
        'html',
        'text-summary',
      ],
    },
  },
  resolve: {
    alias: {
      // import.meta.dirname (Node 20.11+) replaces the CommonJS-only __dirname
      "main": path.resolve(import.meta.dirname, "./src/main"),
      "fixtures": path.resolve(import.meta.dirname, "./src/fixtures"),
      "tests": path.resolve(import.meta.dirname, "./src/tests"),
    }
  },
  server: {
    port: 3000,
  },

});
