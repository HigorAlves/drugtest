import { Module } from '@nestjs/common'

import { DatabaseModule } from '../../infrastructure/database/database.module'
import { IndicationMappingModule } from '../indication-mapping/indication-mapping.module'
import { IndicationsModule } from '../indications/indications.module'
import { DrugsController } from './drugs.controller'
import { DrugsService } from './drugs.service'

@Module({
	imports: [DatabaseModule, IndicationsModule, IndicationMappingModule],
	controllers: [DrugsController],
	providers: [DrugsService],
	exports: [DrugsService],
})
export class DrugsModule {}
