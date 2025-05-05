import { MappingResult, ScrapedIndication } from '../models/indication-mapping.model'

/**
 * Interface for the indication mapping service
 * This interface defines the contract for mapping indications to ICD-10 codes
 */
export interface IndicationMappingServiceInterface {
	/**
	 * Maps a scraped indication to an ICD-10 code
	 * @param scraped - The scraped indication to map
	 * @returns Promise<MappingResult> - The mapping result
	 */
	mapScrapedIndication(scraped: ScrapedIndication): Promise<MappingResult>

	/**
	 * Maps multiple scraped indications to ICD-10 codes
	 * @param scrapedIndications - The scraped indications to map
	 * @returns Promise<MappingResult[]> - The mapping results
	 */
	mapMultipleScrapedIndications(scrapedIndications: ScrapedIndication[]): Promise<MappingResult[]>
}
