# Observability Package

This package provides observability capabilities for enterprise applications, including distributed tracing and metrics
collection using OpenTelemetry.

## Features

- **Distributed Tracing**: Track requests as they flow through your application
- **Metrics Collection**: Measure and monitor application performance
- **Automatic Instrumentation**: Automatically instrument common libraries and frameworks
- **Decorators**: Easily add tracing and metrics to your methods
- **GraphQL Support**: Specialized instrumentation for GraphQL operations
- **Environment Configuration**: Configure observability through environment variables

## Installation

```bash
yarn add @enterprise/observability
```

## Usage

### Initialize Tracing

Initialize the OpenTelemetry SDK at the start of your application:

```typescript
import { initializeTracing } from '@enterprise/observability'

// Initialize with default service name from environment variables
initializeTracing()

// Or with a custom service name
initializeTracing('my-service')
```

### Manual Tracing

Create spans manually:

```typescript
import { createTracer, createSpan, SpanKind } from '@enterprise/observability'

// Create a tracer
const tracer = createTracer('my-component')

// Create a span
const result = await createSpan(
	'operation-name',
	async () => {
		// Your code here
		return someResult
	},
	SpanKind.INTERNAL
)

// Add attributes to the current span
import { addSpanAttributes } from '@enterprise/observability'

addSpanAttributes({
	'attribute.key': 'value',
	'numeric.attribute': 123,
})
```

### Automatic Tracing with Decorators

Use the `@Trace` decorator to automatically trace method calls:

```typescript
import { Trace, SpanKind } from '@enterprise/observability'

class UserService {
	@Trace() // Uses method name as span name
	async getUser(id: string) {
		// Method implementation
	}

	@Trace('fetch-user-details', SpanKind.CLIENT) // Custom span name and kind
	async getUserDetails(id: string) {
		// Method implementation
	}
}
```

### Metrics Collection

Create and use metrics:

```typescript
import {
	createCounter,
	createHistogram,
	createUpDownCounter,
	createGauge,
	createTimer,
	createRateTracker,
} from '@enterprise/observability'

// Create a counter
const requestCounter = createCounter('http.requests', 'Count of HTTP requests')
requestCounter.add(1, { method: 'GET', path: '/users' })

// Create a histogram
const responseTimeHistogram = createHistogram('http.response_time', 'HTTP response time in milliseconds')
responseTimeHistogram.record(42.5, { method: 'GET', path: '/users' })

// Create a timer function
const timeFunction = createTimer('function.execution_time', 'Function execution time in milliseconds')

// Use the timer
await timeFunction(
	async () => {
		// Your code here
	},
	{ function: 'processData' }
)
```

### Automatic Metrics with Decorators

Use metrics decorators to automatically measure method performance:

```typescript
import { Measure, Count, Metrics } from '@enterprise/observability'

class UserService {
	@Measure() // Measures execution time
	async getUser(id: string) {
		// Method implementation
	}

	@Count() // Counts method calls
	async createUser(userData: any) {
		// Method implementation
	}

	@Metrics({
		name: 'user.update',
		description: 'User update operation',
		measureTime: true,
		countCalls: true,
	})
	async updateUser(id: string, userData: any) {
		// Method implementation
	}
}
```

## Configuration

Configure the observability package using environment variables:

```
# OpenTelemetry configuration
NODE_ENV=development
OTEL_SERVICE_NAME=my-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_EXPORTER_OTLP_HEADERS={"Authorization":"Bearer token"}
OTEL_TRACES_SAMPLER=always_on
OTEL_TRACES_SAMPLER_ARG=0.5
OTEL_LOG_LEVEL=info

# Application specific
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
```

## GraphQL Support

This package provides specialized support for GraphQL applications:

### Enable GraphQL Instrumentation

Enable GraphQL instrumentation when initializing tracing:

```typescript
import { initializeTracing } from '@enterprise/observability'

// Enable GraphQL instrumentation with default options
initializeTracing('my-graphql-service', { graphql: true })

// Or with custom options
initializeTracing('my-graphql-service', {
	graphql: {
		captureDocument: true,
		captureVariables: false,
		captureResult: false,
		depth: 2,
	},
})
```

### Trace GraphQL Operations Manually

Create spans for GraphQL operations:

```typescript
import { createGraphQLSpan, SpanKind } from '@enterprise/observability'

// Trace a GraphQL query
const result = await createGraphQLSpan(
	'getUserDetails',
	async () => {
		// Execute GraphQL query
		return client.query({ query: GET_USER_DETAILS, variables: { id } })
	},
	{
		document: GET_USER_DETAILS.loc?.source.body,
		variables: { id },
		kind: SpanKind.CLIENT,
	}
)
```

### Trace GraphQL Resolvers

Use the `@GraphQLTrace` decorator to automatically trace GraphQL resolvers:

```typescript
import { GraphQLTrace, SpanKind } from '@enterprise/observability'
import { Query, Resolver, Arg } from 'type-graphql'
import { User } from './user.model'

@Resolver(User)
class UserResolver {
	@GraphQLTrace()
	@Query(() => User)
	async user(@Arg('id') id: string): Promise<User> {
		// Resolver implementation
	}

	@GraphQLTrace('fetch-user-details', { kind: SpanKind.SERVER })
	@Query(() => [User])
	async users(): Promise<User[]> {
		// Resolver implementation
	}
}
```

## Integration with Backends

This package exports traces and metrics using the OTLP HTTP protocol, which is compatible with:

- Jaeger
- Zipkin
- Prometheus
- OpenTelemetry Collector
- Grafana Tempo
- Datadog
- New Relic
- And many other observability platforms

## License

ISC
