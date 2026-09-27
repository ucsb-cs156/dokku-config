import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import { defineConfig, globalIgnores } from 'eslint/config'

// Import the vitest plugin
import vitest from '@vitest/eslint-plugin'

export default defineConfig([
  globalIgnores(['dist', '.stryker-tmp/', '.storybook/', 'build', 'coverage', 'node_modules',  'public/mockServiceWorker.js', 'storybook-static/']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // eslint-plugin-react-hooks 7 added rules derived from the React Compiler.
      // This project does not use the React Compiler, and this rule only reports
      // that the compiler *would* skip memoizing components that call APIs such
      // as react-hook-form's `watch()` or TanStack Table's `useReactTable()`.
      'react-hooks/incompatible-library': 'off',
    },
  },
  {
    // Apply this configuration only to test files
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: vitest.environments.env.globals, // Use vitest's globals
    },
    rules: {
      // Vitest recommended rules
      ...vitest.configs.recommended.rules,
    },
  },
  // Storybook's recommended rules for *.stories.* files (and .storybook/ config)
  ...storybook.configs['flat/recommended'],
])
