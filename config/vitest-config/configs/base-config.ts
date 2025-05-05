import { defineConfig } from 'vitest/config'
import tsconfigPath from 'vite-tsconfig-paths'

export const baseConfig = defineConfig({
	plugins: [tsconfigPath() as never],
	test: {
		passWithNoTests: true,
		coverage: {
			provider: 'istanbul',
			reporter: [
				'html',
				[
					'json',
					{
						file: `../coverage.json`,
					},
				],
			],
			enabled: true,
		},
	},
})
