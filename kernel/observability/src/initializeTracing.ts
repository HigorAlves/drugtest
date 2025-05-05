import * as process from 'node:process'

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql'
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

import { ENV } from './env'

interface Params {
	serviceName?: string // Optional service name to override the one from environment variables
	version?: string // Optional service version to override the one from environment variables
	options?: {
		useGraphql?: boolean
	}
}

export class InitializeTracing {
	private static instance: InitializeTracing
	private sdk: NodeSDK | undefined
	private readonly traceExporter = new OTLPTraceExporter({
		url: `${ENV.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
		compression: CompressionAlgorithm.GZIP,
		headers: ENV.OTEL_EXPORTER_OTLP_HEADERS ? JSON.parse(ENV.OTEL_EXPORTER_OTLP_HEADERS) : {},
	})
	private readonly instrumentation = [
		getNodeAutoInstrumentations({
			'@opentelemetry/instrumentation-winston': { enabled: true },
		}),
	]

	private constructor() {}

	static initialize(params: Params) {
		if (!this.instance) {
			const instance = new InitializeTracing()
			return instance.initializeTracing(params)
		}
		return this.instance.sdk
	}

	private addGraphqlInstrumentation(activate: boolean) {
		if (activate) {
			const graphqlInstrumentation = new GraphQLInstrumentation({
				mergeItems: true,
				depth: 4,
				responseHook: (span, result) => span.setAttribute('graphql.result', JSON.stringify(result)),
			})
			this.instrumentation.push(graphqlInstrumentation as never)
		}
	}

	private async shutdown(SDK: NodeSDK) {
		try {
			await SDK.shutdown()
		} catch (error) {
			console.error('Error shutting down OpenTelemetry SDK:', error)
		} finally {
			process.exit(0)
		}
	}

	private initializeTracing(params: Params) {
		const { serviceName, version, options } = params
		const { useGraphql } = options || { useGraphql: false }

		this.addGraphqlInstrumentation(!!useGraphql)
		const SDK = new NodeSDK({
			resource: resourceFromAttributes({
				[ATTR_SERVICE_NAME]: serviceName || ENV.OTEL_SERVICE_NAME,
				[ATTR_SERVICE_VERSION]: version || ENV.OTEL_SERVICE_VERSION,
			}),
			traceExporter: this.traceExporter,
			instrumentations: this.instrumentation,
			metricReader: new PeriodicExportingMetricReader({
				exporter: new ConsoleMetricExporter(),
			}),
		})

		try {
			SDK.start()
		} catch (error) {
			console.error('Error starting OpenTelemetry SDK:', error)
		}

		process.on('SIGTERM', this.shutdown)
		process.on('SIGINT', this.shutdown)
		process.on('beforeExit', this.shutdown)

		return SDK
	}
}
