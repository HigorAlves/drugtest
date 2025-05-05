import { Injectable, NotFoundException, Inject } from '@nestjs/common'

import { Drug } from '../../domain/models/drug.model'
import { DrugRepository } from '../../domain/repositories/drug.repository'

/**
 * Use case for finding a drug by ID
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class FindDrugByIdUseCase {
	constructor(@Inject('DrugRepository') private readonly drugRepository: DrugRepository) {}

	/**
	 * Execute the use case
	 * @param id - Drug ID
	 * @returns Promise<Drug> - Drug
	 * @throws NotFoundException - If drug is not found
	 */
	async execute(id: string): Promise<Drug> {
		const drug = await this.drugRepository.findById(id)
		if (!drug) {
			throw new NotFoundException('Drug not found')
		}
		return drug
	}
}
