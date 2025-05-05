import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import pluginReact from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

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
			onlyWarn,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'warn',
			'object-curly-spacing': ['error', 'always'],
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
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
		ignores: ['dist/**'],
	},
]
