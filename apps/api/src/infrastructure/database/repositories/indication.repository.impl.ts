import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Indication } from '../../../domain/models/indication.model'
import { IndicationRepository } from '../../../domain/repositories/indication.repository'
import { IndicationEntity } from '../entities'

/**
 * Implementation of the IndicationRepository interface
 * This class adapts the TypeORM repository to the domain repository interface
 */
@Injectable()
export class IndicationRepositoryImpl implements IndicationRepository {
	constructor(
		@InjectRepository(IndicationEntity)
		private readonly indicationRepository: Repository<IndicationEntity>
	) {}

	/**
	 * Find all indications
	 * @returns Promise<Indication[]> - List of indications
	 */
	async findAll(): Promise<Indication[]> {
		const indicationEntities = await this.indicationRepository.find()
		return indicationEntities.map((entity) => entity.toDomain())
	}

	/**
	 * Find an indication by ID
	 * @param id - Indication ID
	 * @returns Promise<Indication | undefined> - Indication if found, undefined otherwise
	 */
	async findById(id: string): Promise<Indication | undefined> {
		const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
		return indicationEntity ? indicationEntity.toDomain() : undefined
	}

	/**
	 * Find indications by drug ID
	 * @param drugId - Drug ID
	 * @returns Promise<Indication[]> - List of indications for the drug
	 */
	async findByDrugId(drugId: string): Promise<Indication[]> {
		const indicationEntities = await this.indicationRepository.find({ where: { drugId } })
		return indicationEntities.map((entity) => entity.toDomain())
	}

	/**
	 * Create a new indication
	 * @param indication - Indication to create
	 * @returns Promise<Indication> - Created indication
	 */
	async create(indication: Indication): Promise<Indication> {
		const indicationEntity = IndicationEntity.fromDomain(indication)
		await this.indicationRepository.save(indicationEntity)
		return indication
	}

	/**
	 * Update an indication
	 * @param id - Indication ID
	 * @param indicationData - Updated indication data
	 * @returns Promise<Indication> - Updated indication
	 */
	async update(id: string, indicationData: Partial<Indication>): Promise<Indication> {
		const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
		if (!indicationEntity) {
			throw new Error('Indication not found')
		}

		const updatedEntity = {
			...indicationEntity,
			...indicationData,
		}

		await this.indicationRepository.save(updatedEntity)
		return new Indication(updatedEntity)
	}

	/**
	 * Delete an indication
	 * @param id - Indication ID
	 * @returns Promise<void>
	 */
	async delete(id: string): Promise<void> {
		const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
		if (!indicationEntity) {
			throw new Error('Indication not found')
		}

		await this.indicationRepository.remove(indicationEntity)
	}
}
