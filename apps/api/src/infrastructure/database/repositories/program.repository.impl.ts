import { Injectable, Inject } from '@nestjs/common'

import { Program } from '../../../domain/models/program.model'
import { DrugRepository } from '../../../domain/repositories/drug.repository'
import { IndicationRepository } from '../../../domain/repositories/indication.repository'
import { ProgramRepository } from '../../../domain/repositories/program.repository'

/**
 * Implementation of the ProgramRepository interface
 * This class adapts the drug and indication repositories to the program repository interface
 */
@Injectable()
export class ProgramRepositoryImpl implements ProgramRepository {
	constructor(
		@Inject('DrugRepository') private readonly drugRepository: DrugRepository,
		@Inject('IndicationRepository') private readonly indicationRepository: IndicationRepository
	) {}

	/**
	 * Find a program by ID
	 * @param id - Program ID (same as drug ID)
	 * @returns Promise<Program | undefined> - Program if found, undefined otherwise
	 */
	async findById(id: string): Promise<Program | undefined> {
		// Get the drug
		const drug = await this.drugRepository.findById(id)
		if (!drug) {
			return undefined
		}

		// Get the indications for the drug
		const indications = await this.indicationRepository.findByDrugId(id)

		// Return the program
		return new Program({
			id: drug.id,
			name: drug.name,
			labelUrl: drug.labelUrl,
			indications,
		})
	}
}
