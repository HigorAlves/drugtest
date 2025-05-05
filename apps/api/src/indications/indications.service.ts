import { Indication } from '@enterprise/domain'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { INDICATION_REPOSITORY } from '../database/constants'
import { IndicationEntity } from '../database/entity'

@Injectable()
export class IndicationsService {
  constructor(
    @Inject(INDICATION_REPOSITORY)
    private indicationRepository: Repository<IndicationEntity>
  ) {}

  async findAll(): Promise<Indication[]> {
    const indicationEntities = await this.indicationRepository.find()
    return indicationEntities.map(entity => entity.toDomain())
  }

  async findByDrugId(drugId: string): Promise<Indication[]> {
    const indicationEntities = await this.indicationRepository.find({ where: { drugId } })
    return indicationEntities.map(entity => entity.toDomain())
  }

  async findOne(id: string): Promise<Indication | undefined> {
    const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
    return indicationEntity ? indicationEntity.toDomain() : undefined
  }

  async create(
    description: string,
    icd10Code: string,
    drugId: string,
    sourceText?: string,
    mappingConfidence?: number
  ): Promise<Indication> {
    const newIndication = new Indication({
      id: uuidv4(),
      description,
      icd10Code,
      drugId,
      sourceText,
      mappingConfidence,
    })

    const indicationEntity = IndicationEntity.fromDomain(newIndication)
    await this.indicationRepository.save(indicationEntity)

    return newIndication
  }

  async update(id: string, data: Partial<Indication>): Promise<Indication> {
    const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
    if (!indicationEntity) {
      throw new NotFoundException('Indication not found')
    }

    const updatedEntity = {
      ...indicationEntity,
      ...data,
    }

    Indication.validatePartial(updatedEntity)
    await this.indicationRepository.save(updatedEntity)

    return new Indication(updatedEntity)
  }

  async remove(id: string): Promise<void> {
    const indicationEntity = await this.indicationRepository.findOne({ where: { id } })
    if (!indicationEntity) {
      throw new NotFoundException('Indication not found')
    }

    await this.indicationRepository.remove(indicationEntity)
  }
}