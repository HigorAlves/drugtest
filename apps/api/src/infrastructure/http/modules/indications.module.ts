import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CreateIndicationUseCase,
  DeleteIndicationUseCase,
  FindAllIndicationsUseCase,
  FindIndicationByIdUseCase,
  FindIndicationsByDrugIdUseCase,
  UpdateIndicationUseCase,
} from '../../../application/indications';
import { IndicationRepository } from '../../../domain/repositories/indication.repository';
import { IndicationEntity } from '../../database/entities/indication.entity';
import { IndicationRepositoryImpl } from '../../database/repositories/indication.repository.impl';
import { IndicationsController } from '../controllers/indications.controller';

/**
 * Module for indication-related components
 * This module ties together controllers, use cases, and repositories
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([IndicationEntity]),
  ],
  controllers: [IndicationsController],
  providers: [
    // Use cases
    FindAllIndicationsUseCase,
    FindIndicationByIdUseCase,
    FindIndicationsByDrugIdUseCase,
    CreateIndicationUseCase,
    UpdateIndicationUseCase,
    DeleteIndicationUseCase,

    // Repositories
    {
      provide: IndicationRepository,
      useClass: IndicationRepositoryImpl,
    },
  ],
  exports: [
    FindAllIndicationsUseCase,
    FindIndicationByIdUseCase,
    FindIndicationsByDrugIdUseCase,
    CreateIndicationUseCase,
    UpdateIndicationUseCase,
    DeleteIndicationUseCase,
    IndicationRepository,
  ],
})
export class IndicationsModule {}