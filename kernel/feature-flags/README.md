# Feature Flags Package

## Overview

The Feature Flags package provides a standardized way to implement feature flags (also known as feature toggles) across
the application. It enables controlled feature rollout, A/B testing, and environment-specific feature availability.

## Key Components

### FeatureFlagService

The core service for managing and evaluating feature flags:

- Caching mechanism for improved performance
- Environment-aware flag evaluation
- Type-safe flag values (boolean, string, number, JSON)
- Context-based flag evaluation for targeted features

### FeatureFlagProvider

Interface for different feature flag storage implementations:

- Allows for different backends (in-memory, database, remote API)
- Consistent API regardless of storage mechanism
- Extensible for custom provider implementations

### UseFeatureFlagDecorator

Decorator for easily injecting the feature flag service into classes.

## Usage Examples

### Basic Setup

```typescript
import { FeatureFlagService, MemoryFeatureFlagProvider, setGlobalFeatureFlagService } from '@enterprise/feature-flags'

// Create a provider
const provider = new MemoryFeatureFlagProvider()

// Create the service
const featureFlagService = new FeatureFlagService({
	provider,
	defaultEnvironment: 'development',
	cacheTTL: 60000, // 1 minute
})

// Initialize the service
await featureFlagService.initialize()

// Set as the global service for use with the decorator
setGlobalFeatureFlagService(featureFlagService)
```

### Creating Feature Flags

```typescript
// Create a simple boolean flag
await featureFlagService.upsertFlag({
	name: 'new-feature',
	description: 'Enables the new feature',
	enabled: true,
})

// Create a flag with a string value
await featureFlagService.upsertFlag({
	name: 'theme',
	description: 'The application theme',
	enabled: true,
	valueType: 'string',
	value: 'dark',
})

// Create a flag with conditions
await featureFlagService.upsertFlag({
	name: 'premium-feature',
	description: 'Feature only available to premium users',
	enabled: true,
	conditions: {
		userType: 'premium',
	},
})

// Create an environment-specific flag
await featureFlagService.upsertFlag({
	name: 'experimental-feature',
	description: 'Experimental feature only available in development',
	enabled: true,
	environment: 'development',
})
```

### Checking Feature Flags

```typescript
// Check if a feature is enabled
const isEnabled = await featureFlagService.isEnabled('new-feature')
if (isEnabled) {
	// Feature is enabled
} else {
	// Feature is disabled
}

// Get a feature flag value
const theme = await featureFlagService.getValue('theme', 'light')
console.log(`Using theme: ${theme}`)

// Check a feature with context
const isPremiumEnabled = await featureFlagService.isEnabled('premium-feature', {
	userType: 'premium',
})

// Check a feature in a specific environment
const isExperimentalEnabled = await featureFlagService.isEnabled('experimental-feature', {
	environment: 'production',
})
```

### Using the Decorator

```typescript
import { UseFeatureFlagDecorator } from '@enterprise/feature-flags'

class UserService {
	@UseFeatureFlagDecorator()
	private featureFlags

	async getUserProfile(userId: string) {
		const profile = await this.fetchUserProfile(userId)

		// Check if the new profile format is enabled
		if (await this.featureFlags.isEnabled('new-profile-format')) {
			return this.formatNewProfile(profile)
		} else {
			return this.formatLegacyProfile(profile)
		}
	}

	async getUserSettings(userId: string) {
		const settings = await this.fetchUserSettings(userId)

		// Get the default theme from feature flags
		const theme = await this.featureFlags.getValue('default-theme', 'light')

		return {
			...settings,
			theme: settings.theme || theme,
		}
	}
}
```

## Custom Providers

You can implement custom providers by extending the `BaseFeatureFlagProvider` class:

```typescript
import { BaseFeatureFlagProvider, FeatureFlag } from '@enterprise/feature-flags'

class DatabaseFeatureFlagProvider extends BaseFeatureFlagProvider {
	private db

	constructor(dbConnection) {
		super()
		this.db = dbConnection
	}

	async initialize(): Promise<void> {
		// Initialize database connection
	}

	async getAllFlags(): Promise<FeatureFlag[]> {
		// Fetch all flags from database
	}

	async getFlag(name: string): Promise<FeatureFlag | null> {
		// Fetch a specific flag from database
	}

	async upsertFlag(flag: FeatureFlag): Promise<FeatureFlag> {
		// Create or update a flag in the database
	}

	async deleteFlag(name: string): Promise<boolean> {
		// Delete a flag from the database
	}

	async evaluateFlag(name: string, context?: Record<string, any>): Promise<FeatureFlagEvaluationResult> {
		// Evaluate a flag based on context
	}
}
```

## Best Practices

1. **Initialize Early**: Initialize the feature flag service during application startup
2. **Default Values**: Always provide default values when getting flag values
3. **Caching**: Use appropriate cache TTL values based on how frequently flags change
4. **Error Handling**: Handle potential errors when evaluating flags
5. **Testing**: Create test-specific providers for predictable behavior in tests
6. **Documentation**: Document the purpose and expected behavior of each feature flag
7. **Cleanup**: Remove flags that are no longer needed after features are fully rolled out
