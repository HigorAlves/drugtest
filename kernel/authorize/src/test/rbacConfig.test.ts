import { describe, expect, it } from 'vitest'

import { Action, RBACConfig, Role, Subject } from '../'

describe('RBACConfig', () => {
	it('should have all required roles defined', () => {
		// Check that all roles from the Role enum are defined in the config
		Object.values(Role).forEach((role) => {
			expect(RBACConfig.roles[role]).toBeDefined()
		})
	})

	it('should have proper structure for each role', () => {
		// Check that each role has the required properties
		Object.values(Role).forEach((role) => {
			const roleConfig = RBACConfig.roles[role]
			expect(roleConfig).toHaveProperty('can')
			expect(Array.isArray(roleConfig!.can)).toBe(true)
		})
	})

	it('should have valid permission rules', () => {
		// Check that each permission rule has a valid action and subject
		Object.values(Role).forEach((role) => {
			const roleConfig = RBACConfig.roles[role]

			// Check 'can' rules
			roleConfig!.can.forEach((rule) => {
				expect(Object.values(Action)).toContain(rule.action)
				expect(Object.values(Subject)).toContain(rule.subject)
			})

			// Check 'cannot' rules if they exist
			if (roleConfig!.cannot) {
				roleConfig!.cannot.forEach((rule) => {
					expect(Object.values(Action)).toContain(rule.action)
					expect(Object.values(Subject)).toContain(rule.subject)
				})
			}
		})
	})

	it('should have valid inheritance', () => {
		// Check that inherited roles exist in the config
		Object.values(Role).forEach((role) => {
			const roleConfig = RBACConfig.roles[role]

			if (roleConfig!.inherits) {
				roleConfig!.inherits.forEach((inheritedRole) => {
					expect(Object.values(Role)).toContain(inheritedRole)
					expect(RBACConfig.roles[inheritedRole]).toBeDefined()
				})
			}
		})
	})

	// Test specific role configurations
	it('should configure Admin role with manage all permission', () => {
		const adminConfig = RBACConfig.roles[Role.Admin]
		expect(adminConfig!.can).toContainEqual({
			action: Action.Manage,
			subject: Subject.All,
		})
	})

	it('should configure User role with appropriate permissions', () => {
		const userConfig = RBACConfig.roles[Role.User]

		// User can read all
		expect(userConfig!.can).toContainEqual(
			expect.objectContaining({
				action: Action.Read,
				subject: Subject.All,
			})
		)

		// User can create comments
		expect(userConfig!.can).toContainEqual(
			expect.objectContaining({
				action: Action.Create,
				subject: Subject.Comment,
			})
		)

		// User cannot delete users
		expect(userConfig!.cannot).toContainEqual(
			expect.objectContaining({
				action: Action.Delete,
				subject: Subject.User,
			})
		)
	})

	it('should configure Editor role to inherit from User role', () => {
		const editorConfig = RBACConfig.roles[Role.Editor]
		expect(editorConfig!.inherits).toContain(Role.User)
	})
})
