import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

/**
 * DTO for updating an indication
 * This class defines the structure of the request body for updating an indication
 */
export class UpdateIndicationDto {
	/**
	 * The description of the indication
	 * @example "Treatment of mild to moderate pain"
	 */
	@ApiProperty({
		description: 'The description of the indication',
		example: 'Treatment of mild to moderate pain',
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string

	/**
	 * The ICD-10 code for the indication
	 * @example "R52.2"
	 */
	@ApiProperty({
		description: 'The ICD-10 code for the indication',
		example: 'R52.2',
		required: false,
	})
	@IsString()
	@IsOptional()
	icd10Code?: string

	/**
	 * The ID of the drug this indication is for
	 * @example "123e4567-e89b-12d3-a456-426614174000"
	 */
	@ApiProperty({
		description: 'The ID of the drug this indication is for',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: false,
	})
	@IsUUID()
	@IsOptional()
	drugId?: string

	/**
	 * The original source text from which this indication was extracted
	 * @example "For the treatment of mild to moderate pain and inflammation"
	 */
	@ApiProperty({
		description: 'The original source text from which this indication was extracted',
		example: 'For the treatment of mild to moderate pain and inflammation',
		required: false,
	})
	@IsString()
	@IsOptional()
	sourceText?: string

	/**
	 * The confidence level of the mapping to ICD-10 code (0-1)
	 * @example 0.85
	 */
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
