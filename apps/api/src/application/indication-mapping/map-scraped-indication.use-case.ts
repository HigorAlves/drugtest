import { Injectable } from '@nestjs/common';

import { MappingResult, ScrapedIndication } from '../../domain/models/indication-mapping.model';
import { IndicationMappingServiceInterface } from '../../domain/services/indication-mapping.service.interface';

/**
 * Use case for mapping a scraped indication to an ICD-10 code
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class MapScrapedIndicationUseCase {
  constructor(private readonly indicationMappingService: IndicationMappingServiceInterface) {}

  /**
   * Execute the use case
   * @param scraped - The scraped indication to map
   * @returns Promise<MappingResult> - The mapping result
   */
  async execute(scraped: ScrapedIndication): Promise<MappingResult> {
    return this.indicationMappingService.mapScrapedIndication(scraped);
  }
}