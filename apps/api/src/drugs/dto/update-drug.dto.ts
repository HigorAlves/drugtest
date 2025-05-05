import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

export class UpdateDrugDto {
  @ApiProperty({
    description: 'The name of the drug',
    example: 'Aspirin',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The URL to the drug label',
    example: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6993e1d-4e70-4e42-b916-c61f407f3a88',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  labelUrl?: string
}