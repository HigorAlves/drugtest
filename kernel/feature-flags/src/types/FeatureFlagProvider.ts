/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureFlag, FeatureFlagEvaluationResult } from '@/FeatureFlag'

export interface FeatureFlagProvider {
	initialize(): Promise<void>
	getAllFlags(): Promise<FeatureFlag[]>
	getFlag(name: string): Promise<FeatureFlag | null>
	upsertFlag(flag: FeatureFlag): Promise<FeatureFlag>
	deleteFlag(name: string): Promise<boolean>

	/**
	 * Evaluate a feature flag for a given context
	 *
	 * @param name - The name of the feature flag
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	evaluateFlag<T = never>(name: string, context?: Record<string, unknown>): Promise<FeatureFlagEvaluationResult<T>>
}

export abstract class BaseFeatureFlagProvider implements FeatureFlagProvider {
	abstract initialize(): Promise<void>
	abstract getAllFlags(): Promise<FeatureFlag[]>

	/**
	 * Get a feature flag by name
	 *
	 * @param name - The name of the feature flag
	 */
	abstract getFlag(name: string): Promise<FeatureFlag | null>

	/**
	 * Create or update a feature flag
	 *
	 * @param flag - The feature flag to create or update
	 */
	abstract upsertFlag(flag: FeatureFlag): Promise<FeatureFlag>

	/**
	 * Delete a feature flag
	 *
	 * @param name - The name of the feature flag to delete
	 */
	abstract deleteFlag(name: string): Promise<boolean>

	/**
	 * Evaluate a feature flag for a given context
	 *
	 * @param name - The name of the feature flag
	 * @param context - The evaluation context (e.g., user, environment)
	 */
	abstract evaluateFlag<T = any>(name: string, context?: Record<string, any>): Promise<FeatureFlagEvaluationResult<T>>
}
