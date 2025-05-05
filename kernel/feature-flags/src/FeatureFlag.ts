import { z } from 'zod'

export enum FeatureFlagValueType {
	BOOLEAN = 'boolean',
	STRING = 'string',
	NUMBER = 'number',
	JSON = 'json',
}

export const FeatureFlagSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	enabled: z.boolean().default(false),
	valueType: z.nativeEnum(FeatureFlagValueType).default(FeatureFlagValueType.BOOLEAN),
	value: z.union([z.boolean(), z.string(), z.number(), z.record(z.any())]).optional(),
	environment: z.string().optional(),
	group: z.string().optional(),
	conditions: z.record(z.any()).optional(),
	createdAt: z
		.date()
		.optional()
		.default(() => new Date()),
	updatedAt: z
		.date()
		.optional()
		.default(() => new Date()),
})

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>

export interface FeatureFlagEvaluationResult<T = never> {
	enabled: boolean
	value?: T
	flag: FeatureFlag
}
