import { z } from 'zod'

import { IndicationSchema } from './indication.model'

/**
 * Schema for a program
 */
export const ProgramSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'Program name is required' }),
  labelUrl: z.string().url({ message: 'Label URL must be a valid URL' }),
  indications: z.array(IndicationSchema).optional(),
})

/**
 * Type for a program
 */
export type ProgramType = z.infer<typeof ProgramSchema>

/**
 * Domain model for a program
 * A program represents a drug and its associated indications
 */
export class Program {
  id: string
  name: string
  labelUrl: string
  indications?: z.infer<typeof IndicationSchema>[]

  constructor(data: ProgramType) {
    const validatedData = ProgramSchema.parse(data)
    this.id = validatedData.id
    this.name = validatedData.name
    this.labelUrl = validatedData.labelUrl
    this.indications = validatedData.indications
  }

  static validate(program: unknown): ProgramType {
    return ProgramSchema.parse(program)
  }

  static validatePartial(program: unknown): Partial<ProgramType> {
    return ProgramSchema.partial().parse(program)
  }
}
