import { Injectable, Inject } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

import { Drug } from '../../domain/models/drug.model'
import { DrugRepository } from '../../domain/repositories/drug.repository'

/**
 * Use case for creating a new drug
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class CreateDrugUseCase {
	constructor(@Inject('DrugRepository') private readonly drugRepository: DrugRepository) {}

	/**
	 * Execute the use case
	 * @param name - Drug name
	 * @param labelUrl - URL to the drug's label
	 * @returns Promise<Drug> - Created drug
	 */
	async execute(name: string, labelUrl: string): Promise<Drug> {
		// Create a new drug domain object
		const newDrug = new Drug({
			id: uuidv4(),
			name,
			labelUrl,
		})

		// Save the drug to the repository
		return this.drugRepository.create(newDrug)
	}
}
