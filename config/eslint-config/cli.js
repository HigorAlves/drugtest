import { resolve } from 'node:path'

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import pluginReact from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

const project = resolve(process.cwd(), 'tsconfig.json')

const configs = tseslint.config(
	js.configs.recommended,
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	eslintConfigPrettier,
	turboPlugin.configs['flat/recommended']
)
/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
	...configs,
	{
		plugins: {
			turbo: turboPlugin,
			'simple-import-sort': simpleImportSort,
		},
		languageOptions: {
			env: 'node',
		},
		settings: {
			'import/resolver': {
				typescript: {
					project,
				},
			},
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'warn',
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'object-curly-spacing': ['error', 'always'],
			'max-len': ['error', { code: 120 }],
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{
					allowShortCircuit: true,
					allowTernary: true,
					allowTaggedTemplates: true,
				},
			],
		},
	},
	{
		plugins: {
			onlyWarn,
		},
	},
	{
		ignores: ['**/temp.js', 'dist/**', '.*.js', 'node_modules/'],
	},
]
