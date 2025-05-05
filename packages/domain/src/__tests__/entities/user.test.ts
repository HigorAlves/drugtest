import { v4 as uuidv4 } from 'uuid'
import { describe, expect, it } from 'vitest'

import { User, UserRole, UserType } from '@/entities/user'

describe('User Entity', () => {
	const validUserData: UserType = {
		id: uuidv4(),
		username: 'testuser',
		passwordHash: 'hashedpassword123',
		role: UserRole.USER,
	}

	describe('constructor', () => {
		it('should create a valid User instance with USER role', () => {
			const user = new User(validUserData)

			expect(user).toBeInstanceOf(User)
			expect(user.id).toBe(validUserData.id)
			expect(user.username).toBe(validUserData.username)
			expect(user.passwordHash).toBe(validUserData.passwordHash)
			expect(user.role).toBe(UserRole.USER)
		})

		it('should create a valid User instance with ADMIN role', () => {
			const adminData = {
				...validUserData,
				role: UserRole.ADMIN,
			}

			const user = new User(adminData)

			expect(user).toBeInstanceOf(User)
			expect(user.role).toBe(UserRole.ADMIN)
		})

		it('should throw an error if id is not a valid UUID', () => {
			const invalidData = {
				...validUserData,
				id: 'not-a-uuid',
			}

			expect(() => new User(invalidData)).toThrow()
		})

		it('should throw an error if username is less than 3 characters', () => {
			const invalidData = {
				...validUserData,
				username: 'ab',
			}

			expect(() => new User(invalidData)).toThrow()
		})

		it('should throw an error if passwordHash is empty', () => {
			const invalidData = {
				...validUserData,
				passwordHash: '',
			}

			expect(() => new User(invalidData)).toThrow()
		})

		it('should throw an error if role is invalid', () => {
			const invalidData = {
				...validUserData,
				role: 'GUEST' as UserRole, // Type assertion to bypass TypeScript check
			}

			expect(() => new User(invalidData)).toThrow()
		})
	})

	describe('validate', () => {
		it('should validate a valid user object', () => {
			const result = User.validate(validUserData)

			expect(result).toEqual(validUserData)
		})

		it('should throw an error for invalid user object', () => {
			const invalidData = {
				...validUserData,
				username: 'ab', // Too short
			}

			expect(() => User.validate(invalidData)).toThrow()
		})
	})

	describe('validatePartial', () => {
		it('should validate a partial user object', () => {
			const partialData = {
				username: 'partialuser',
				role: UserRole.ADMIN,
			}

			const result = User.validatePartial(partialData)

			expect(result).toEqual(partialData)
		})

		it('should throw an error for invalid partial user object', () => {
			const invalidPartialData = {
				username: 'ab', // Too short
			}

			expect(() => User.validatePartial(invalidPartialData)).toThrow()
		})
	})
})
