import { Injectable } from '@nestjs/common';

import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

/**
 * Use case for finding indications by drug ID
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindIndicationsByDrugIdUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  /**
   * Execute the use case
   * @param drugId - Drug ID
   * @returns Promise<Indication[]> - List of indications for the drug
   */
  async execute(drugId: string): Promise<Indication[]> {
    return this.indicationRepository.findByDrugId(drugId);
  }
}