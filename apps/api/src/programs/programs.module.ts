import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { DrugsModule } from '../drugs/drugs.module'
import { IndicationsModule } from '../indications/indications.module'
import { ProgramsController } from './programs.controller'
import { ProgramsService } from './programs.service'

@Module({
  imports: [DatabaseModule, DrugsModule, IndicationsModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}