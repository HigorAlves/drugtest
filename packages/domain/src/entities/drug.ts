import { z } from 'zod';

export const DrugSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Drug name is required" }),
  labelUrl: z.string().url({ message: "Label URL must be a valid URL" }),
});

export type DrugType = z.infer<typeof DrugSchema>;

export class Drug {
  id: string;
  name: string;
  labelUrl: string;

  constructor(data: DrugType) {
    const validatedData = DrugSchema.parse(data);
    this.id = validatedData.id;
    this.name = validatedData.name;
    this.labelUrl = validatedData.labelUrl;
  }

  static validate(drug: unknown): DrugType {
    return DrugSchema.parse(drug);
  }

  static validatePartial(drug: unknown): Partial<DrugType> {
    return DrugSchema.partial().parse(drug);
  }
}