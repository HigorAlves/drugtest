import { UserRole } from './user.model'

/**
 * JWT payload model
 * This interface defines the structure of the JWT payload
 */
export interface JwtPayload {
	/**
	 * User ID
	 */
	sub: string

	/**
	 * Username
	 */
	username: string

	/**
	 * User role
	 */
	role: UserRole
}
