import { z } from 'zod';

export const IndicationSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, { message: "Description is required" }),
  icd10Code: z.string().min(1, { message: "ICD-10 code is required" }),
  drugId: z.string().uuid({ message: "Drug ID must be a valid UUID" }),
  sourceText: z.string().optional(),
  mappingConfidence: z.number().min(0).max(1).optional(),
});

export type IndicationType = z.infer<typeof IndicationSchema>;

export class Indication {
  id: string;
  description: string;
  icd10Code: string;
  drugId: string;
  sourceText?: string;
  mappingConfidence?: number;

  constructor(data: IndicationType) {
    const validatedData = IndicationSchema.parse(data);
    this.id = validatedData.id;
    this.description = validatedData.description;
    this.icd10Code = validatedData.icd10Code;
    this.drugId = validatedData.drugId;
    this.sourceText = validatedData.sourceText;
    this.mappingConfidence = validatedData.mappingConfidence;
  }

  static validate(indication: unknown): IndicationType {
    return IndicationSchema.parse(indication);
  }

  static validatePartial(indication: unknown): Partial<IndicationType> {
    return IndicationSchema.partial().parse(indication);
  }
}