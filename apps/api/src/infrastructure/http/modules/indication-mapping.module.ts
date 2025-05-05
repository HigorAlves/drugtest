import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MapMultipleScrapedIndicationsUseCase, MapScrapedIndicationUseCase } from '../../../application/indication-mapping';
import { IndicationMappingServiceInterface } from '../../../domain/services/indication-mapping.service.interface';
import { IndicationMappingServiceImpl } from '../../external/mapping/indication-mapping.service.impl';

/**
 * Module for indication mapping components
 * This module ties together use cases and service implementations
 */
@Module({
  imports: [ConfigModule],
  providers: [
    // Use cases
    MapScrapedIndicationUseCase,
    MapMultipleScrapedIndicationsUseCase,

    // Service implementations
    {
      provide: IndicationMappingServiceInterface,
      useClass: IndicationMappingServiceImpl,
    },
  ],
  exports: [
    MapScrapedIndicationUseCase,
    MapMultipleScrapedIndicationsUseCase,
    IndicationMappingServiceInterface,
  ],
})
export class IndicationMappingModule {}