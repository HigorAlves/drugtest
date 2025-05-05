import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl } from 'class-validator'

/**
 * DTO for updating a drug
 * This class defines the structure of the request body for updating a drug
 */
export class UpdateDrugDto {
	/**
	 * Name of the drug
	 * @example "Aspirin"
	 */
	@ApiProperty({
		description: 'Name of the drug',
		example: 'Aspirin',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string

	/**
	 * URL to the drug's label
	 * @example "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6993e1d-4e32-4a6a-9432-36e2a5b7a822"
	 */
	@ApiProperty({
		description: "URL to the drug's label",
		example: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6993e1d-4e32-4a6a-9432-36e2a5b7a822',
		required: false,
	})
	@IsOptional()
	@IsUrl()
	labelUrl?: string
}
