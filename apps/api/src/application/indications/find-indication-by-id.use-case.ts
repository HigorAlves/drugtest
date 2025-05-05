import { Injectable, NotFoundException } from '@nestjs/common';

import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

/**
 * Use case for finding an indication by ID
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindIndicationByIdUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  /**
   * Execute the use case
   * @param id - Indication ID
   * @returns Promise<Indication> - Indication
   * @throws NotFoundException - If indication is not found
   */
  async execute(id: string): Promise<Indication> {
    const indication = await this.indicationRepository.findById(id);
    if (!indication) {
      throw new NotFoundException('Indication not found');
    }
    return indication;
  }
}