import { Module } from '@nestjs/common'

import { FindProgramByIdUseCase } from '../../../application/programs'
import { ProgramRepositoryImpl } from '../../database/repositories/program.repository.impl'
import { ProgramsController } from '../controllers/programs.controller'
import { DrugsModule } from './drugs.module'
import { IndicationsModule } from './indications.module'

/**
 * Module for program-related components
 * This module ties together controllers, use cases, and repositories
 */
@Module({
	imports: [DrugsModule, IndicationsModule],
	controllers: [ProgramsController],
	providers: [
		// Use cases
		FindProgramByIdUseCase,

		// Repositories
		{
			provide: 'ProgramRepository',
			useClass: ProgramRepositoryImpl,
		},
		{
			provide: ProgramRepositoryImpl,
			useClass: ProgramRepositoryImpl,
		},
	],
	exports: [FindProgramByIdUseCase, 'ProgramRepository', ProgramRepositoryImpl],
})
export class ProgramsModule {}
