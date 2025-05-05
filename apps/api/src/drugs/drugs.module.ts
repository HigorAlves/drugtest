import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { IndicationsModule } from '../indications/indications.module'
import { DrugsController } from './drugs.controller'
import { DrugsService } from './drugs.service'

@Module({
  imports: [DatabaseModule, IndicationsModule],
  controllers: [DrugsController],
  providers: [DrugsService],
  exports: [DrugsService],
})
export class DrugsModule {}
