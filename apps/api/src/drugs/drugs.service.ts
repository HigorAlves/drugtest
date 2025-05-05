import { Drug } from '@enterprise/domain'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { DRUG_REPOSITORY } from '../database/constants'
import { DrugEntity } from '../database/entity'

@Injectable()
export class DrugsService {
  constructor(
    @Inject(DRUG_REPOSITORY)
    private drugRepository: Repository<DrugEntity>
  ) {}

  async findAll(): Promise<Drug[]> {
    const drugEntities = await this.drugRepository.find()
    return drugEntities.map(entity => entity.toDomain())
  }

  async findOne(id: string): Promise<Drug | undefined> {
    const drugEntity = await this.drugRepository.findOne({ where: { id } })
    return drugEntity ? drugEntity.toDomain() : undefined
  }

  async create(name: string, labelUrl: string): Promise<Drug> {
    const newDrug = new Drug({
      id: uuidv4(),
      name,
      labelUrl,
    })

    const drugEntity = DrugEntity.fromDomain(newDrug)
    await this.drugRepository.save(drugEntity)

    return newDrug
  }

  async update(id: string, data: Partial<Drug>): Promise<Drug> {
    const drugEntity = await this.drugRepository.findOne({ where: { id } })
    if (!drugEntity) {
      throw new NotFoundException('Drug not found')
    }

    const updatedEntity = {
      ...drugEntity,
      ...data,
    }

    Drug.validatePartial(updatedEntity)
    await this.drugRepository.save(updatedEntity)

    return new Drug(updatedEntity)
  }

  async remove(id: string): Promise<void> {
    const drugEntity = await this.drugRepository.findOne({ where: { id } })
    if (!drugEntity) {
      throw new NotFoundException('Drug not found')
    }

    await this.drugRepository.remove(drugEntity)
  }
}