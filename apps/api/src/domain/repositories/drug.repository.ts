import { Drug } from '../models/drug.model';

/**
 * Repository interface for Drug entity
 * This interface defines the contract for drug repository implementations
 */
export interface DrugRepository {
  /**
   * Find all drugs
   * @returns Promise<Drug[]> - List of drugs
   */
  findAll(): Promise<Drug[]>;

  /**
   * Find a drug by ID
   * @param id - Drug ID
   * @returns Promise<Drug | undefined> - Drug if found, undefined otherwise
   */
  findById(id: string): Promise<Drug | undefined>;

  /**
   * Create a new drug
   * @param drug - Drug to create
   * @returns Promise<Drug> - Created drug
   */
  create(drug: Drug): Promise<Drug>;

  /**
   * Update a drug
   * @param id - Drug ID
   * @param drug - Updated drug data
   * @returns Promise<Drug> - Updated drug
   */
  update(id: string, drug: Partial<Drug>): Promise<Drug>;

  /**
   * Delete a drug
   * @param id - Drug ID
   * @returns Promise<void>
   */
  delete(id: string): Promise<void>;
}