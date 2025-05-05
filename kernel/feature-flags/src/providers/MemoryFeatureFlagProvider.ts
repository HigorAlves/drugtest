/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureFlag, FeatureFlagEvaluationResult, FeatureFlagSchema } from '@/FeatureFlag'
import { BaseFeatureFlagProvider } from '@/types'
import { FeatureFlagError, FeatureFlagErrorCode } from '@/utils'

/**
 * In-memory implementation of the FeatureFlagProvider interface
 *
 * This provider stores feature flags in memory and is suitable for
 * development, testing, or simple applications. For production use,
 * consider implementing a provider that uses a database or remote API.
 */
export class MemoryFeatureFlagProvider extends BaseFeatureFlagProvider {
	private flags: Map<string, FeatureFlag> = new Map()
	private initialized = false

	async initialize(): Promise<void> {
		this.initialized = true
	}

	async getAllFlags(): Promise<FeatureFlag[]> {
		this.ensureInitialized()
		return Array.from(this.flags.values())
	}

	async getFlag(name: string): Promise<FeatureFlag | null> {
		this.ensureInitialized()
		return this.flags.get(name) || null
	}

	async upsertFlag(flag: FeatureFlag): Promise<FeatureFlag> {
		this.ensureInitialized()

		try {
			const validatedFlag = FeatureFlagSchema.parse({
				...flag,
				updatedAt: new Date(),
			})

			this.flags.set(validatedFlag.name, validatedFlag)
			return validatedFlag
		} catch (error) {
			throw new FeatureFlagError(
				`Invalid feature flag: ${(error as Error).message}`,
				FeatureFlagErrorCode.INVALID_FLAG,
				{ flag, originalError: error }
			)
		}
	}

	async deleteFlag(name: string): Promise<boolean> {
		this.ensureInitialized()
		return this.flags.delete(name)
	}

	/**
	 * Evaluate a feature flag for a given context
	 *
	 * @param name - The name of the feature flag
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	async evaluateFlag<T = any>(name: string, context?: Record<string, any>): Promise<FeatureFlagEvaluationResult<T>> {
		this.ensureInitialized()

		const flag = await this.getFlag(name)

		if (!flag) {
			throw new FeatureFlagError(`Feature flag '${name}' not found`, FeatureFlagErrorCode.FLAG_NOT_FOUND, {
				flagName: name,
				context,
			})
		}

		// Simple environment-based evaluation
		if (flag.environment && context?.environment && flag.environment !== context.environment) {
			return {
				enabled: false,
				flag,
			}
		}

		// Simple condition evaluation (very basic implementation)
		if (flag.conditions && Object.keys(flag.conditions).length > 0) {
			const conditionsMet = Object.entries(flag.conditions).every(([key, value]) => {
				return context?.[key] === value
			})

			if (!conditionsMet) {
				return {
					enabled: false,
					flag,
				}
			}
		}

		return {
			enabled: flag.enabled,
			value: flag.value as T,
			flag,
		}
	}

	private ensureInitialized(): void {
		if (!this.initialized) {
			throw new FeatureFlagError(
				'Memory feature flag provider is not initialized. Call initialize() first.',
				FeatureFlagErrorCode.INITIALIZATION_ERROR
			)
		}
	}
}
