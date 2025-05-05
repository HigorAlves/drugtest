import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

import { MappingResult, ScrapedIndication } from '../../../domain/models/indication-mapping.model'
import { IndicationMappingServiceInterface } from '../../../domain/services/indication-mapping.service.interface'

/**
 * Implementation of the IndicationMappingServiceInterface
 * This class uses OpenAI's API to map indications to ICD-10 codes
 */
@Injectable()
export class IndicationMappingServiceImpl implements IndicationMappingServiceInterface {
	private readonly logger = new Logger(IndicationMappingServiceImpl.name)
	private openai: OpenAI

	constructor(private configService: ConfigService) {
		try {
			const apiKey = this.configService.get<string>('OPENAI_API_KEY')
			if (!apiKey) {
				this.logger.warn('OPENAI_API_KEY not found in environment variables')
			}
			this.openai = new OpenAI({ apiKey })
		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Maps a scraped indication to an ICD-10 code
	 * @param scraped - The scraped indication to map
	 * @returns Promise<MappingResult> - The mapping result
	 */
	async mapScrapedIndication(scraped: ScrapedIndication): Promise<MappingResult> {
		try {
			const prompt = `Map the following medical indication to an ICD-10 code:\n\nIndication: "${scraped.indication}"\nDescription: "${scraped.description}"`

			const response = await this.openai.chat.completions.create({
				model: 'gpt-4',
				messages: [
					{
						role: 'system',
						content: `You are a medical coding assistant. Your task is to map medical indications to ICD-10 codes.
Return your response in JSON format with the following fields:
- description: A cleaned up, standardized version of the indication
- icd10Code: The most appropriate ICD-10 code for the indication
- mappingConfidence: A number between 0 and 1 representing your confidence in the mapping

If you cannot map the indication to an ICD-10 code, use "UNMAPPABLE" as the code and explain why in the description.
Handle synonyms appropriately (e.g., "Hypertension" and "High Blood Pressure" should map to the same code).
For drugs with multiple indications, map each indication separately.`,
					},
					{ role: 'user', content: prompt },
				],
				temperature: 0.2,
				response_format: { type: 'json_object' },
			})

			const content = response.choices[0]?.message?.content
			if (!content) {
				throw new Error('No content in OpenAI response')
			}

			const result = JSON.parse(content)

			return new MappingResult({
				description: result.description || scraped.description,
				icd10Code: result.icd10Code || 'UNMAPPABLE',
				mappingConfidence: result.mappingConfidence ?? 0.5,
				sourceText: `${scraped.indication} - ${scraped.description}`,
			})
		} catch (error) {
			this.logger.error(`Error mapping indication to ICD-10: ${error.message}`, error.stack)
			return new MappingResult({
				description: scraped.description,
				icd10Code: 'UNMAPPABLE',
				mappingConfidence: 0,
				sourceText: `${scraped.indication} - ${scraped.description}`,
			})
		}
	}

	/**
	 * Maps multiple scraped indications to ICD-10 codes
	 * @param scrapedIndications - The scraped indications to map
	 * @returns Promise<MappingResult[]> - The mapping results
	 */
	async mapMultipleScrapedIndications(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]> {
		const mappingPromises = scrapedIndications.map((scraped) => this.mapScrapedIndication(scraped))
		return Promise.all(mappingPromises)
	}
}
