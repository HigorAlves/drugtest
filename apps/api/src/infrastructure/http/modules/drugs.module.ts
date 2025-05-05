import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IndicationMappingModule } from './indication-mapping.module'
import { IndicationsModule } from './indications.module'

import {
	CreateDrugUseCase,
	DeleteDrugUseCase,
	FindAllDrugsUseCase,
	FindDrugByIdUseCase,
	UpdateDrugUseCase,
} from '../../../application/drugs'
import { DrugEntity } from '../../database/entities'
import { DrugRepositoryImpl } from '../../database/repositories/drug.repository.impl'
import { DrugsController } from '../controllers/drugs.controller'

/**
 * Module for drug-related components
 * This module ties together controllers, use cases, and repositories
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([DrugEntity]),
		IndicationMappingModule,
		IndicationsModule,
	],
	controllers: [DrugsController],
	providers: [
		// Use cases
		FindAllDrugsUseCase,
		FindDrugByIdUseCase,
		CreateDrugUseCase,
		UpdateDrugUseCase,
		DeleteDrugUseCase,

		// Repositories
		{
			provide: 'DrugRepository',
			useClass: DrugRepositoryImpl,
		},
		{
			provide: DrugRepositoryImpl,
			useClass: DrugRepositoryImpl,
		},
	],
	exports: [
		FindAllDrugsUseCase,
		FindDrugByIdUseCase,
		CreateDrugUseCase,
		UpdateDrugUseCase,
		DeleteDrugUseCase,
		'DrugRepository',
		DrugRepositoryImpl,
	],
})
export class DrugsModule {}
