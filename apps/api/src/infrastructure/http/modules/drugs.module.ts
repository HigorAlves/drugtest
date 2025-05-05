import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
	imports: [TypeOrmModule.forFeature([DrugEntity])],
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
		DrugRepositoryImpl,
	],
})
export class DrugsModule {}
