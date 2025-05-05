import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

/**
 * Use case for creating a new indication
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class CreateIndicationUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  /**
   * Execute the use case
   * @param description - Description of the indication
   * @param icd10Code - ICD-10 code for the indication
   * @param drugId - ID of the drug this indication is for
   * @param sourceText - Original source text from which this indication was extracted
   * @param mappingConfidence - Confidence level of the mapping to ICD-10 code
   * @returns Promise<Indication> - Created indication
   */
  async execute(
    description: string,
    icd10Code: string,
    drugId: string,
    sourceText?: string,
    mappingConfidence?: number
  ): Promise<Indication> {
    // Create a new indication domain object
    const newIndication = new Indication({
      id: uuidv4(),
      description,
      icd10Code,
      drugId,
      sourceText,
      mappingConfidence,
    });

    // Save the indication to the repository
    return this.indicationRepository.create(newIndication);
  }
}