import { Injectable, NotFoundException, Inject } from '@nestjs/common'

import { IndicationRepository } from '../../domain/repositories/indication.repository'

/**
 * Use case for deleting an indication
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class DeleteIndicationUseCase {
	constructor(@Inject('IndicationRepository') private readonly indicationRepository: IndicationRepository) {}

	/**
	 * Execute the use case
	 * @param id - Indication ID
	 * @returns Promise<void>
	 * @throws NotFoundException - If indication is not found
	 */
	async execute(id: string): Promise<void> {
		// Check if indication exists
		const existingIndication = await this.indicationRepository.findById(id)
		if (!existingIndication) {
			throw new NotFoundException('Indication not found')
		}

		// Delete the indication
		return this.indicationRepository.delete(id)
	}
}
