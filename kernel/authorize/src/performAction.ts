/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAbacSubject, defineAbilityFor } from './abilityFactory'
import { Action, IUser, Subject } from './types'

/**
 * Permission check result
 */
export interface PermissionCheckResult {
	allowed: boolean
	reason?: string
	fields?: string[]
}

/**
 * Checks if a user can perform an action on a subject
 *
 * This function supports both RBAC and ABAC:
 * - RBAC: Checks if the user's role allows the action on the subject
 * - ABAC: Checks if the user can perform the action based on attributes
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param action The action to check
 * @param subject The subject type or subject object with attributes
 * @returns A result object indicating if the action is allowed
 */
export function checkPermission(
	user: IUser,
	action: Action,
	subject: Subject | Record<string, any>
): PermissionCheckResult {
	const ability = defineAbilityFor(user)

	// If subject is an object (for ABAC), create a proper CASL subject
	const caslSubject =
		typeof subject === 'object' && !Object.values(Subject).includes(subject as unknown as Subject)
			? createAbacSubject(subject.type || Subject.All, subject)
			: subject

	const allowed = ability.can(action, caslSubject)

	// Get the rule that matched (if any)
	const rule = allowed ? ability.relevantRuleFor(action, caslSubject) : null

	return {
		allowed,
		reason: rule?.reason,
		fields: rule?.fields as string[] | undefined,
	}
}

/**
 * Performs an action if the user has permission, otherwise throws an error
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param action The action to perform
 * @param subject The subject type or subject object with attributes
 * @param callback The function to call if the action is allowed
 * @returns The result of the callback function
 * @throws Error if the user doesn't have permission
 */
export function performAction<T>(
	user: IUser,
	action: Action,
	subject: Subject | Record<string, any>,
	callback: () => T
): T {
	const { allowed, reason } = checkPermission(user, action, subject)

	if (allowed) {
		return callback()
	} else {
		const subjectName = typeof subject === 'object' ? subject.type || JSON.stringify(subject) : subject

		throw new Error(reason || `User with role ${user.role} is not allowed to ${action} ${subjectName}.`)
	}
}

/**
 * Filters fields based on user permissions
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param action The action to check
 * @param subject The subject with data
 * @returns The subject with only the fields the user has permission to access
 */
export function filterFields<T extends Record<string, any>>(user: IUser, action: Action, subject: T): Partial<T> {
	const { allowed, fields } = checkPermission(user, action, subject)

	if (!allowed) {
		return {}
	}

	// If no specific fields are defined, return all fields
	if (!fields || fields.length === 0) {
		return subject
	}

	// Return only the fields the user has permission to access
	return Object.fromEntries(Object.entries(subject).filter(([key]) => fields.includes(key))) as Partial<T>
}
