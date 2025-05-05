// @ts-expect-error The base is working
import { baseConfig } from '@enterprise/vitest-config/base'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	process.env = { ...process.env, ...env }

	return {
		...baseConfig,
	}
})
