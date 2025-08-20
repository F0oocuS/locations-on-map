import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import tsEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,jsx}'],
		extends: [
			js.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			prettierConfig,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: {jsx: true},
				sourceType: 'module',
			},
		},
		rules: {
			'no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
		}
	},
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'@typescript-eslint': tsEslint,
		},
		extends: [
			js.configs.recommended,
			'@typescript-eslint/recommended',
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			prettierConfig,
		],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: {jsx: true},
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
		}
	},
])
