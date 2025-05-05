import { Injectable } from '@nestjs/common';
import { Drug } from '../../domain/models/drug.model';
import { DrugRepository } from '../../domain/repositories/drug.repository';

/**
 * Use case for finding all drugs
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindAllDrugsUseCase {
  constructor(private readonly drugRepository: DrugRepository) {}

  /**
   * Execute the use case
   * @returns Promise<Drug[]> - List of drugs
   */
  async execute(): Promise<Drug[]> {
    return this.drugRepository.findAll();
  }
}