import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { IndicationsController } from './indications.controller'
import { IndicationsService } from './indications.service'

@Module({
  imports: [DatabaseModule],
  controllers: [IndicationsController],
  providers: [IndicationsService],
  exports: [IndicationsService],
})
export class IndicationsModule {}