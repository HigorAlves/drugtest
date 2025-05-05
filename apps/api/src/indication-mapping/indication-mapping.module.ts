import { Module } from '@nestjs/common';
import { IndicationMappingService } from './indication-mapping.service';

@Module({
  providers: [IndicationMappingService],
  exports: [IndicationMappingService],
})
export class IndicationMappingModule {}