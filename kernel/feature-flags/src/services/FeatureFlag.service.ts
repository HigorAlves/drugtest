/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureFlag, FeatureFlagEvaluationResult } from '@/FeatureFlag'
import { FeatureFlagProvider } from '@/types'
import { FeatureFlagError, FeatureFlagErrorCode } from '@/utils'

export interface FeatureFlagServiceConfig {
	provider: FeatureFlagProvider
	defaultEnvironment?: string
	cacheTTL?: number
}

/**
 * Feature flag service
 *
 * This service provides methods for managing and evaluating feature flags.
 * It uses a provider to store and retrieve feature flags and provides
 * caching and evaluation logic.
 */
export class FeatureFlagService {
	private provider: FeatureFlagProvider
	private cache: Map<string, { flag: FeatureFlag; timestamp: number }> = new Map()
	private initialized = false
	private readonly defaultEnvironment: string
	private readonly cacheTTL: number

	constructor(config: FeatureFlagServiceConfig) {
		this.provider = config.provider
		this.defaultEnvironment = config.defaultEnvironment || 'development'
		this.cacheTTL = config.cacheTTL ?? 60000 // Default to 1 minute
	}

	/**
	 * Initialize the feature flag service
	 *
	 * This method must be called before using the service.
	 */
	async initialize(): Promise<void> {
		if (this.initialized) {
			return
		}

		try {
			await this.provider.initialize()
			this.initialized = true
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to initialize feature flag service: ${(error as Error).message}`,
				FeatureFlagErrorCode.INITIALIZATION_ERROR,
				{ originalError: error }
			)
		}
	}

	async getAllFlags(): Promise<FeatureFlag[]> {
		this.ensureInitialized()
		try {
			const flags = await this.provider.getAllFlags()

			if (this.cacheTTL > 0) {
				const now = Date.now()
				flags.forEach((flag) => {
					this.cache.set(flag.name, { flag, timestamp: now })
				})
			}

			return flags
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to get all feature flags: ${(error as Error).message}`,
				FeatureFlagErrorCode.PROVIDER_ERROR,
				{ originalError: error }
			)
		}
	}

	/**
	 * Get a feature flag by name
	 *
	 * @param name - The name of the feature flag
	 * @param forceRefresh - Whether to bypass the cache and fetch fresh data
	 */
	async getFlag(name: string, forceRefresh = false): Promise<FeatureFlag | null> {
		this.ensureInitialized()

		if (!forceRefresh && this.cacheTTL > 0) {
			const cached = this.cache.get(name)
			if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
				return cached.flag
			}
		}

		try {
			const flag = await this.provider.getFlag(name)
			if (flag && this.cacheTTL > 0) {
				this.cache.set(name, { flag, timestamp: Date.now() })
			}

			return flag
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to get feature flag '${name}': ${(error as Error).message}`,
				FeatureFlagErrorCode.PROVIDER_ERROR,
				{ flagName: name, originalError: error }
			)
		}
	}

	async upsertFlag(flag: FeatureFlag): Promise<FeatureFlag> {
		this.ensureInitialized()

		try {
			const flagWithEnv = {
				...flag,
				environment: flag.environment || this.defaultEnvironment,
			}
			const updatedFlag = await this.provider.upsertFlag(flagWithEnv)
			if (this.cacheTTL > 0) {
				this.cache.set(updatedFlag.name, { flag: updatedFlag, timestamp: Date.now() })
			}

			return updatedFlag
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to upsert feature flag '${flag.name}': ${(error as Error).message}`,
				FeatureFlagErrorCode.PROVIDER_ERROR,
				{ flag, originalError: error }
			)
		}
	}

	async deleteFlag(name: string): Promise<boolean> {
		this.ensureInitialized()

		try {
			const result = await this.provider.deleteFlag(name)
			if (result && this.cacheTTL > 0) {
				this.cache.delete(name)
			}

			return result
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to delete feature flag '${name}': ${(error as Error).message}`,
				FeatureFlagErrorCode.PROVIDER_ERROR,
				{ flagName: name, originalError: error }
			)
		}
	}

	/**
	 * Check if a feature flag is enabled
	 *
	 * @param name - The name of the feature flag
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	async isEnabled(name: string, context?: Record<string, any>): Promise<boolean> {
		const result = await this.evaluate(name, context)
		return result.enabled
	}

	/**
	 * Get the value of a feature flag
	 *
	 * @param name - The name of the feature flag
	 * @param defaultValue - The default value to return if the flag is not found or disabled
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	async getValue<T = never>(name: string, defaultValue: T, context?: Record<string, any>): Promise<T> {
		const result = await this.evaluate<T>(name, context)
		return result.enabled && result.value !== undefined ? result.value : defaultValue
	}

	/**
	 * Evaluate a feature flag
	 *
	 * @param name - The name of the feature flag
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	async evaluate<T = never>(name: string, context?: Record<string, any>): Promise<FeatureFlagEvaluationResult<T>> {
		this.ensureInitialized()

		try {
			const evaluationContext = {
				...context,
				environment: context?.environment || this.defaultEnvironment,
			}

			return await this.provider.evaluateFlag<T>(name, evaluationContext)
		} catch (error) {
			throw new FeatureFlagError(
				`Failed to evaluate feature flag '${name}': ${(error as Error).message}`,
				FeatureFlagErrorCode.EVALUATION_ERROR,
				{ flagName: name, context, originalError: error }
			)
		}
	}

	clearCache(): void {
		this.cache.clear()
	}

	private ensureInitialized(): void {
		if (!this.initialized) {
			throw new FeatureFlagError(
				'Feature flag service is not initialized. Call initialize() first.',
				FeatureFlagErrorCode.INITIALIZATION_ERROR
			)
		}
	}
}
