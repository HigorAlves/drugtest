import { Program } from '../models/program.model'

/**
 * Repository interface for Program entity
 * This interface defines the contract for program repository implementations
 */
export interface ProgramRepository {
	/**
	 * Find a program by ID
	 * @param id - Program ID (same as drug ID)
	 * @returns Promise<Program | undefined> - Program if found, undefined otherwise
	 */
	findById(id: string): Promise<Program | undefined>
}
