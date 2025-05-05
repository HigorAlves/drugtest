import { Injectable, NotFoundException } from '@nestjs/common'

import { DrugsService } from '../drugs/drugs.service'
import { IndicationsService } from '../indications/indications.service'

export interface ProgramResponse {
  id: string
  name: string
  labelUrl: string
  indications: {
    id: string
    description: string
    icd10Code: string
    mappingConfidence: number
    sourceText?: string
  }[]
}

@Injectable()
export class ProgramsService {
  constructor(
    private readonly drugsService: DrugsService,
    private readonly indicationsService: IndicationsService
  ) {}

  /**
   * Get a program by ID
   * @param id The program ID (same as drug ID)
   * @returns The program details including drug and indications
   */
  async findOne(id: string): Promise<ProgramResponse> {
    // Get the drug
    const drug = await this.drugsService.findOne(id)
    if (!drug) {
      throw new NotFoundException(`Program with ID ${id} not found`)
    }

    // Get the indications for the drug
    const indications = await this.indicationsService.findByDrugId(id)

    // Return the program response
    return {
      id: drug.id,
      name: drug.name,
      labelUrl: drug.labelUrl,
      indications: indications.map(indication => ({
        id: indication.id,
        description: indication.description,
        icd10Code: indication.icd10Code,
        mappingConfidence: indication.mappingConfidence || 0,
        sourceText: indication.sourceText
      }))
    }
  }
}