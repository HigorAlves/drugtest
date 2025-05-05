import { Injectable } from '@nestjs/common';

import { MappingResult, ScrapedIndication } from '../../domain/models/indication-mapping.model';
import { IndicationMappingServiceInterface } from '../../domain/services/indication-mapping.service.interface';

/**
 * Use case for mapping multiple scraped indications to ICD-10 codes
 * This class orchestrates the flow of data between the domain layer and the infrastructure layer
 */
@Injectable()
export class MapMultipleScrapedIndicationsUseCase {
  constructor(private readonly indicationMappingService: IndicationMappingServiceInterface) {}

  /**
   * Execute the use case
   * @param scrapedIndications - The scraped indications to map
   * @returns Promise<MappingResult[]> - The mapping results
   */
  async execute(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]> {
    return this.indicationMappingService.mapMultipleScrapedIndications(scrapedIndications);
  }
}