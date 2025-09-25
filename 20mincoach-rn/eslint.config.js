// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';

export default [
  // Ignora cosas que no quieres lintar
  { ignores: ['node_modules/**', 'dist/**', '.expo/**'] },

  // 🔧 Este bloque marca el config como entorno Node
  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // Tu configuración para TS/React
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(), // <- ya no dará error
      },
    },
    plugins: { '@typescript-eslint': tseslint, react, import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
      },
    },
    rules: {
      // ...tus reglas
    },
  },
];
