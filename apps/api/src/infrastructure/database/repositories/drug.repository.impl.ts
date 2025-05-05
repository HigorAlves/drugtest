import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Drug } from '../../../domain/models/drug.model'
import { DrugRepository } from '../../../domain/repositories/drug.repository'
import { DrugEntity } from '../entities'

/**
 * Implementation of the DrugRepository interface
 * This class adapts the TypeORM repository to the domain repository interface
 */
@Injectable()
export class DrugRepositoryImpl implements DrugRepository {
	constructor(
		@InjectRepository(DrugEntity)
		private readonly drugRepository: Repository<DrugEntity>
	) {}

	/**
	 * Find all drugs
	 * @returns Promise<Drug[]> - List of drugs
	 */
	async findAll(): Promise<Drug[]> {
		const drugEntities = await this.drugRepository.find()
		return drugEntities.map((entity) => entity.toDomain())
	}

	/**
	 * Find a drug by ID
	 * @param id - Drug ID
	 * @returns Promise<Drug | undefined> - Drug if found, undefined otherwise
	 */
	async findById(id: string): Promise<Drug | undefined> {
		const drugEntity = await this.drugRepository.findOne({ where: { id } })
		return drugEntity ? drugEntity.toDomain() : undefined
	}

	/**
	 * Create a new drug
	 * @param drug - Drug to create
	 * @returns Promise<Drug> - Created drug
	 */
	async create(drug: Drug): Promise<Drug> {
		const drugEntity = DrugEntity.fromDomain(drug)
		await this.drugRepository.save(drugEntity)
		return drug
	}

	/**
	 * Update a drug
	 * @param id - Drug ID
	 * @param drugData - Updated drug data
	 * @returns Promise<Drug> - Updated drug
	 */
	async update(id: string, drugData: Partial<Drug>): Promise<Drug> {
		const drugEntity = await this.drugRepository.findOne({ where: { id } })
		if (!drugEntity) {
			throw new Error('Drug not found')
		}

		const updatedEntity = {
			...drugEntity,
			...drugData,
		}

		await this.drugRepository.save(updatedEntity)
		return new Drug(updatedEntity)
	}

	/**
	 * Delete a drug
	 * @param id - Drug ID
	 * @returns Promise<void>
	 */
	async delete(id: string): Promise<void> {
		const drugEntity = await this.drugRepository.findOne({ where: { id } })
		if (!drugEntity) {
			throw new Error('Drug not found')
		}

		await this.drugRepository.remove(drugEntity)
	}
}
