import { Injectable, NotFoundException, Inject } from '@nestjs/common'

import { DrugRepository } from '../../domain/repositories/drug.repository'

/**
 * Use case for deleting a drug
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class DeleteDrugUseCase {
	constructor(@Inject('DrugRepository') private readonly drugRepository: DrugRepository) {}

	/**
	 * Execute the use case
	 * @param id - Drug ID
	 * @returns Promise<void>
	 * @throws NotFoundException - If drug is not found
	 */
	async execute(id: string): Promise<void> {
		// Check if drug exists
		const existingDrug = await this.drugRepository.findById(id)
		if (!existingDrug) {
			throw new NotFoundException('Drug not found')
		}

		// Delete the drug
		return this.drugRepository.delete(id)
	}
}
