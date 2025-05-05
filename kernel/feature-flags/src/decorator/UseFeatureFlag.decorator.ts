/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeatureFlagService } from '@/services'

const FEATURE_FLAG_SERVICE_KEY = Symbol('featureFlagService')
let globalFeatureFlagService: FeatureFlagService | null = null
export function setGlobalFeatureFlagService(service: FeatureFlagService): void {
	globalFeatureFlagService = service
}
export function getGlobalFeatureFlagService(): FeatureFlagService | null {
	return globalFeatureFlagService
}

/**
 * Decorator for injecting the feature flag service into a class property
 *
 * @example
 * ```TypeScript
 * class MyService {
 *   @UseFeatureFlagDecorator()
 *   private featureFlags: FeatureFlagService;
 *
 *   async doSomething() {
 *     if (await this.featureFlags.isEnabled('my-feature')) {
 *       // Do something when the feature is enabled
 *     } else {
 *       // Do something else when the feature is disabled
 *     }
 *   }
 * }
 * ```
 *
 * @param service - Optional specific feature flag service instance to use
 */
export function UseFeatureFlagDecorator(service?: FeatureFlagService) {
	return function (target: any, propertyKey: string | symbol) {
		const specificService = service || globalFeatureFlagService

		if (!specificService) {
			// eslint-disable-next-line max-len
			const message = `No feature flag service provided for @UseFeatureFlag on ${target.constructor.name}.${String()}.Make sure to call setGlobalFeatureFlagService() before using this decorator, or provide a specific service instance to the decorator.`
			console.warn(message)
		}

		Object.defineProperty(target, propertyKey, {
			get: function () {
				// Use the specific service if provided, otherwise use the one stored in metadata,
				// or fall back to the global service
				const serviceToUse =
					// eslint-disable-next-line max-len
					service || Reflect.getMetadata(FEATURE_FLAG_SERVICE_KEY, target.constructor) || globalFeatureFlagService

				if (!serviceToUse) {
					throw new Error(
						`No feature flag service available for ${target.constructor.name}.${String(propertyKey)}. ` +
							'Make sure to call setGlobalFeatureFlagService() before using this decorator, ' +
							'or provide a specific service instance to the decorator.'
					)
				}

				return serviceToUse
			},
			enumerable: true,
			configurable: true,
		})
	}
}

/**
 * Set the feature flag service for a specific class
 * This is useful for dependency injection frameworks
 *
 * @param target - The class constructor
 * @param service - The feature flag service instance
 */
export function setFeatureFlagServiceForClass(target: any, service: FeatureFlagService): void {
	Reflect.defineMetadata(FEATURE_FLAG_SERVICE_KEY, service, target)
}
