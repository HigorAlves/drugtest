import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

export class UpdateIndicationDto {
  @ApiProperty({
    description: 'The description of the indication',
    example: 'Treatment of mild to moderate pain',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'The ICD-10 code for the indication',
    example: 'R52.2',
    required: false,
  })
  @IsString()
  @IsOptional()
  icd10Code?: string

  @ApiProperty({
    description: 'The ID of the drug this indication is for',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  drugId?: string

  @ApiProperty({
    description: 'The original source text from which this indication was extracted',
    example: 'For the treatment of mild to moderate pain and inflammation',
    required: false,
  })
  @IsString()
  @IsOptional()
  sourceText?: string

  @ApiProperty({
    description: 'The confidence level of the mapping to ICD-10 code (0-1)',
    example: 0.85,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  mappingConfidence?: number
}