/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ability, AbilityBuilder, AbilityClass, subject as createSubject } from '@casl/ability'

import { RBACConfig } from './rbacConfig'
import { Action, IUser, PermissionRule, Role, Subject } from './types'

export type AppAbility = Ability<[Action, Subject | Record<string, any>]>

/**
 * Creates a CASL Ability instance for a user based on their role and attributes
 *
 * This function supports both RBAC and ABAC:
 * - RBAC: Permissions are assigned based on the user's role from RBACConfig
 * - ABAC: Permissions can be conditional based on user attributes and resource attributes
 *
 * @param user The user object containing role and other attributes for ABAC
 * @returns A CASL Ability instance that can be used to check permissions
 */
export const defineAbilityFor = (user: IUser): AppAbility => {
	const { can: allowAction, cannot: forbidAction, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>)

	// Get the role configuration from RBACConfig
	const roleConfig = RBACConfig.roles[user.role]
	if (!roleConfig) {
		// If a role is not defined in config, return an ability with no permissions
		return build()
	}

	// Process role inheritance
	const processedRoles = new Set<Role>()
	const processRole = (roleName: Role) => {
		if (processedRoles.has(roleName)) return
		processedRoles.add(roleName)

		const config = RBACConfig.roles[roleName]
		if (!config) return

		// Process inherited roles first (depth-first)
		if (config.inherits) {
			config.inherits.forEach((inheritedRole) => processRole(inheritedRole))
		}

		// Apply "can" rules
		config.can.forEach((rule) => applyPermissionRule(rule, allowAction, user))

		// Apply "cannot" rules (these take precedence over "can" rules)
		if (config.cannot) {
			config.cannot.forEach((rule) => applyPermissionRule(rule, forbidAction, user))
		}
	}

	// Start processing with the user's role
	processRole(user.role)

	// Apply any user-specific permissions
	if (user.permissions) {
		user.permissions.forEach((rule) => {
			if (rule.inverted) {
				applyPermissionRule(rule, forbidAction, user)
			} else {
				applyPermissionRule(rule, allowAction, user)
			}
		})
	}

	return build()
}

/**
 * Applies a permission rule to the ability builder
 *
 * @param rule The permission rule to apply
 * @param actionFn The function to call (can or cannot)
 * @param user The user object for condition evaluation
 */
function applyPermissionRule(
	rule: PermissionRule,
	actionFn: (action: Action, subject: Subject | Record<string, any>, conditions?: any) => void,
	user: IUser
): void {
	const { action, subject, conditions, fields } = rule

	// For simple rules without conditions or fields
	if (!conditions && !fields) {
		actionFn(action, subject)
		return
	}

	// For rules with conditions and/or fields
	const options: any = {}

	if (fields) {
		options.fields = fields
	}

	// Apply the rule with conditions
	if (conditions) {
		// Transform conditions to include user context if needed
		const transformedConditions = transformConditions(conditions, user)
		actionFn(action, subject, transformedConditions)
	} else {
		actionFn(action, subject, options)
	}
}

/**
 * Transforms ABAC conditions to include user context
 *
 * This function processes special condition keys that depend on user attributes
 *
 * @param conditions The original conditions object
 * @param user The user object
 * @returns Transformed conditions that CASL can evaluate
 */
function transformConditions(conditions: Record<string, any>, user: IUser): Record<string, any> {
	const result: Record<string, any> = {}

	// Process each condition
	Object.entries(conditions).forEach(([key, value]) => {
		switch (key) {
			case 'isOwner':
				// Check if user is the owner of the resource
				if (value === true) {
					result['ownerId'] = user.id
				}
				break
			case 'isAuthor':
				// Check if user is the author of the resource
				if (value === true) {
					result['authorId'] = user.id
				}
				break
			case 'exceptOwnAccount':
				// Prevent action on own account
				if (value === true) {
					result['id'] = { $ne: user.id }
				}
				break
			default:
				// Pass through other conditions
				result[key] = value
		}
	})

	return result
}

/**
 * Creates a subject with an identifier for ABAC checks
 *
 * @param subjectType The type of subject (e.g., Post, User)
 * @param subject The subject object with attributes
 * @returns A CASL subject that can be used for permission checks
 */
export function createAbacSubject<T extends Record<string, any>>(subjectType: Subject, subject: T): T {
	return createSubject(subjectType, subject)
}
