/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'

import {
	Action,
	checkNamedPolicies,
	checkPolicies,
	createPolicyHandler,
	defineAbilityFor,
	enforcePolicies,
	IUser,
	Role,
	Subject,
} from '../'

describe('checkPolicies', () => {
	const regularUser: IUser = {
		id: 'user-101',
		role: Role.User,
	}

	describe('createPolicyHandler', () => {
		it('should create a named policy handler', () => {
			const handler = createPolicyHandler(Action.Read, Subject.Post)

			expect(handler).toHaveProperty('name', 'can-read-Post')
			expect(handler).toHaveProperty('description', 'Can read Post')
			expect(handler).toHaveProperty('handler')
			expect(typeof handler.handler).toBe('function')
		})

		it('should create a policy handler with custom description', () => {
			const handler = createPolicyHandler(Action.Manage, Subject.All, 'Can manage everything')

			expect(handler).toHaveProperty('name', 'can-manage-all')
			expect(handler).toHaveProperty('description', 'Can manage everything')
		})

		it('should create a policy handler that works correctly', () => {
			const handler = createPolicyHandler(Action.Read, Subject.Post)
			const ability = defineAbilityFor(regularUser)

			// Regular user can read posts
			expect(handler.handler(ability)).toBe(true)
		})
	})

	describe('checkPolicies', () => {
		it('should return true when all policies pass', () => {
			const canReadPosts = (ability: any) => ability.can(Action.Read, Subject.Post)
			const canReadComments = (ability: any) => ability.can(Action.Read, Subject.Comment)

			// Regular user can read posts and comments
			const result = checkPolicies(regularUser, canReadPosts, canReadComments)

			expect(result).toBe(true)
		})

		it('should return false when any policy fails', () => {
			const canReadPosts = (ability: { can: (arg0: Action, arg1: Subject) => any }) =>
				ability.can(Action.Read, Subject.Post)
			const canDeletePosts = (ability: { can: (arg0: Action, arg1: Subject) => any }) =>
				ability.can(Action.Delete, Subject.Post)

			// Regular user can read posts but cannot delete them
			const result = checkPolicies(regularUser, canReadPosts, canDeletePosts)

			expect(result).toBe(false)
		})

		it('should handle empty policy list', () => {
			// No policies should pass
			const result = checkPolicies(regularUser)

			expect(result).toBe(true)
		})
	})

	describe('checkNamedPolicies', () => {
		it('should return allowed=true when all policies pass', () => {
			const canReadPosts = createPolicyHandler(Action.Read, Subject.Post)
			const canReadComments = createPolicyHandler(Action.Read, Subject.Comment)

			// Regular user can read posts and comments
			const result = checkNamedPolicies(regularUser, canReadPosts, canReadComments)

			expect(result.allowed).toBe(true)
			expect(result.failedPolicies).toEqual([])
		})

		it('should return allowed=false and list failed policies when any policy fails', () => {
			const canReadPosts = createPolicyHandler(Action.Read, Subject.Post)
			const canDeletePosts = createPolicyHandler(Action.Delete, Subject.Post)
			const canManageAll = createPolicyHandler(Action.Manage, Subject.All)

			// Regular user can read posts but cannot delete them or manage all
			const result = checkNamedPolicies(regularUser, canReadPosts, canDeletePosts, canManageAll)

			expect(result.allowed).toBe(false)
			expect(result.failedPolicies).toContain('can-delete-Post')
			expect(result.failedPolicies).toContain('can-manage-all')
			expect(result.failedPolicies).not.toContain('can-read-Post')
		})

		it('should handle empty policy list', () => {
			// No policies should pass
			const result = checkNamedPolicies(regularUser)

			expect(result.allowed).toBe(true)
			expect(result.failedPolicies).toEqual([])
		})
	})

	describe('enforcePolicies', () => {
		it('should not throw when all policies pass', () => {
			const canReadPosts = createPolicyHandler(Action.Read, Subject.Post)
			const canReadComments = createPolicyHandler(Action.Read, Subject.Comment)

			// Regular user can read posts and comments
			expect(() => {
				enforcePolicies(regularUser, canReadPosts, canReadComments)
			}).not.toThrow()
		})

		it('should throw when any policy fails', () => {
			const canReadPosts = createPolicyHandler(Action.Read, Subject.Post)
			const canDeletePosts = createPolicyHandler(Action.Delete, Subject.Post)

			// Regular user can read posts but cannot delete them
			expect(() => {
				enforcePolicies(regularUser, canReadPosts, canDeletePosts)
			}).toThrow()
		})

		it('should handle empty policy list', () => {
			// No policies should pass
			expect(() => {
				enforcePolicies(regularUser)
			}).not.toThrow()
		})
	})
})
