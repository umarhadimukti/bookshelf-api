import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  // base config
  js.configs.recommended,

  // menggunakan plugin stylistic untuk aturan format kode
  {
    plugins: {
      stylistic
    },
    rules: {
      'stylistic/indent': ['error', 2],
      'stylistic/quotes': ['error', 'single'],
      'stylistic/semi': ['error', 'always'],
      'stylistic/max-len': ['error', { 'code': 100, 'ignoreComments': true }]
    }
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // memperbolehkan console.error untuk error handling
      'no-console': ['error', { 'allow': ['error', 'warn', 'info'] }],
      
      // aturan clean code
      'camelcase': 'error',
      'consistent-return': 'error',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-param-reassign': 'error',
      
      // aturan keamanan untuk database
      'no-template-curly-in-string': 'error', // mencegah template literal salah tempat
      
      // pengecualian untuk pola model database
      'class-methods-use-this': 'off'
    }
  },

  // config khusus untuk file model database
  {
    files: ['**/models/*.{js,mjs,cjs}'],
    rules: {
      // aturan khusus untuk file model
      'class-methods-use-this': 'off'
    }
  }
]);