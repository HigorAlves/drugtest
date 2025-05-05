import { Injectable, NotFoundException } from '@nestjs/common';

import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

/**
 * Use case for updating an indication
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class UpdateIndicationUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  /**
   * Execute the use case
   * @param id - Indication ID
   * @param indicationData - Updated indication data
   * @returns Promise<Indication> - Updated indication
   * @throws NotFoundException - If indication is not found
   */
  async execute(id: string, indicationData: Partial<Indication>): Promise<Indication> {
    // Check if indication exists
    const existingIndication = await this.indicationRepository.findById(id);
    if (!existingIndication) {
      throw new NotFoundException('Indication not found');
    }

    // Validate the updated data
    Indication.validatePartial(indicationData);

    // Update the indication
    return this.indicationRepository.update(id, indicationData);
  }
}