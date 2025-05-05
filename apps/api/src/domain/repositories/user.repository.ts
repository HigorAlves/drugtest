import { User } from '../models/user.model'

/**
 * Repository interface for User entity
 * This interface defines the contract for User repository implementations
 */
export interface UserRepository {
	/**
	 * Find all Users
	 * @returns Promise<User[]> - List of Users
	 */
	findAll(): Promise<User[]>

	/**
	 * Find a User by ID
	 * @param id - User ID
	 * @returns Promise<User | undefined> - User if found, undefined otherwise
	 */
	findById(id: string): Promise<User | undefined>

	/**
	 * Find a User by username
	 * @param username - Username
	 * @returns Promise<User | undefined> - User if found, undefined otherwise
	 */
	findByUsername(username: string): Promise<User | undefined>

	/**
	 * Create a new User
	 * @param User - User to create
	 * @returns Promise<User> - Created User
	 */
	create(User: User): Promise<User>

	/**
	 * Update a User
	 * @param id - User ID
	 * @param User - Updated User data
	 * @returns Promise<User> - Updated User
	 */
	update(id: string, User: Partial<User>): Promise<User>

	/**
	 * Delete a User
	 * @param id - User ID
	 * @returns Promise<void>
	 */
	delete(id: string): Promise<void>
}
