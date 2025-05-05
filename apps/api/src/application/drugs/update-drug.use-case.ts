import { Injectable, NotFoundException } from '@nestjs/common';

import { Drug } from '../../domain/models/drug.model';
import { DrugRepository } from '../../domain/repositories/drug.repository';

/**
 * Use case for updating a drug
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class UpdateDrugUseCase {
  constructor(private readonly drugRepository: DrugRepository) {}

  /**
   * Execute the use case
   * @param id - Drug ID
   * @param drugData - Updated drug data
   * @returns Promise<Drug> - Updated drug
   * @throws NotFoundException - If drug is not found
   */
  async execute(id: string, drugData: Partial<Drug>): Promise<Drug> {
    // Check if drug exists
    const existingDrug = await this.drugRepository.findById(id);
    if (!existingDrug) {
      throw new NotFoundException('Drug not found');
    }

    // Validate the updated data
    Drug.validatePartial(drugData);

    // Update the drug
    return this.drugRepository.update(id, drugData);
  }
}