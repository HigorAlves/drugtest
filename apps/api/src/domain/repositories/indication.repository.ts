import { Indication } from '../models/indication.model'

/**
 * Repository interface for Indication entity
 * This interface defines the contract for Indication repository implementations
 */
export interface IndicationRepository {
	/**
	 * Find all Indications
	 * @returns Promise<Indication[]> - List of Indications
	 */
	findAll(): Promise<Indication[]>

	/**
	 * Find a Indication by ID
	 * @param id - Indication ID
	 * @returns Promise<Indication | undefined> - Indication if found, undefined otherwise
	 */
	findById(id: string): Promise<Indication | undefined>

	/**
	 * Find Indications by Drug ID
	 * @param drugId - Drug ID
	 * @returns Promise<Indication[]> - List of Indications for the drug
	 */
	findByDrugId(drugId: string): Promise<Indication[]>

	/**
	 * Create a new Indication
	 * @param Indication - Indication to create
	 * @returns Promise<Indication> - Created Indication
	 */
	create(Indication: Indication): Promise<Indication>

	/**
	 * Update a Indication
	 * @param id - Indication ID
	 * @param Indication - Updated Indication data
	 * @returns Promise<Indication> - Updated Indication
	 */
	update(id: string, Indication: Partial<Indication>): Promise<Indication>

	/**
	 * Delete a Indication
	 * @param id - Indication ID
	 * @returns Promise<void>
	 */
	delete(id: string): Promise<void>
}
