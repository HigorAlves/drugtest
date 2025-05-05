import { Injectable } from '@nestjs/common';
import { Indication } from '../../domain/models/indication.model';
import { IndicationRepository } from '../../domain/repositories/indication.repository';

/**
 * Use case for finding all indications
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindAllIndicationsUseCase {
  constructor(private readonly indicationRepository: IndicationRepository) {}

  /**
   * Execute the use case
   * @returns Promise<Indication[]> - List of indications
   */
  async execute(): Promise<Indication[]> {
    return this.indicationRepository.findAll();
  }
}