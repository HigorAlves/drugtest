import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

/**
 * DTO for creating a drug
 * This class defines the structure of the request body for creating a drug
 */
export class CreateDrugDto {
	/**
	 * Name of the drug
	 * @example "Aspirin"
	 */
	@ApiProperty({
		description: 'Name of the drug',
		example: 'Aspirin',
	})
	@IsNotEmpty()
	@IsString()
	name: string

	/**
	 * URL to the drug's label
	 * @example "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6993e1d-4e32-4a6a-9432-36e2a5b7a822"
	 */
	@ApiProperty({
		description: "URL to the drug's label",
		example: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6993e1d-4e32-4a6a-9432-36e2a5b7a822',
	})
	@IsNotEmpty()
	@IsUrl()
	labelUrl: string
}
