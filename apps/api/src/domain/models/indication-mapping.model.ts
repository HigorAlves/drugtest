import { z } from 'zod'

/**
 * Schema for a scraped indication
 */
export const ScrapedIndicationSchema = z.object({
  indication: z.string().min(1, { message: 'Indication is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
})

/**
 * Type for a scraped indication
 */
export type ScrapedIndicationType = z.infer<typeof ScrapedIndicationSchema>

/**
 * Domain model for a scraped indication
 */
export class ScrapedIndication {
  indication: string
  description: string

  constructor(data: ScrapedIndicationType) {
    const validatedData = ScrapedIndicationSchema.parse(data)
    this.indication = validatedData.indication
    this.description = validatedData.description
  }

  static validate(scrapedIndication: unknown): ScrapedIndicationType {
    return ScrapedIndicationSchema.parse(scrapedIndication)
  }

  static validatePartial(scrapedIndication: unknown): Partial<ScrapedIndicationType> {
    return ScrapedIndicationSchema.partial().parse(scrapedIndication)
  }
}

/**
 * Schema for a mapping result
 */
export const MappingResultSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  icd10Code: z.string().min(1, { message: 'ICD-10 code is required' }),
  mappingConfidence: z.number().min(0).max(1),
  sourceText: z.string().min(1, { message: 'Source text is required' }),
})

/**
 * Type for a mapping result
 */
export type MappingResultType = z.infer<typeof MappingResultSchema>

/**
 * Domain model for a mapping result
 */
export class MappingResult {
  description: string
  icd10Code: string
  mappingConfidence: number
  sourceText: string

  constructor(data: MappingResultType) {
    const validatedData = MappingResultSchema.parse(data)
    this.description = validatedData.description
    this.icd10Code = validatedData.icd10Code
    this.mappingConfidence = validatedData.mappingConfidence
    this.sourceText = validatedData.sourceText
  }

  static validate(mappingResult: unknown): MappingResultType {
    return MappingResultSchema.parse(mappingResult)
  }

  static validatePartial(mappingResult: unknown): Partial<MappingResultType> {
    return MappingResultSchema.partial().parse(mappingResult)
  }
}