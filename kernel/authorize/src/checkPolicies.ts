import { AppAbility, defineAbilityFor } from './abilityFactory'
import { Action, IUser, PolicyHandler, Subject } from './types'

/**
 * Policy check result
 */
export interface PolicyCheckResult {
	allowed: boolean
	failedPolicies: string[]
}

/**
 * Named policy handler with description
 */
export interface NamedPolicyHandler {
	name: string
	description?: string
	handler: PolicyHandler
}

/**
 * Creates a policy handler that checks if a user can perform an action on a subject
 *
 * @param action The action to check
 * @param subject The subject to check
 * @param description Optional description of the policy
 * @returns A named policy handler
 */
export function createPolicyHandler(action: Action, subject: Subject, description?: string): NamedPolicyHandler {
	return {
		name: `can-${action}-${subject}`,
		description: description || `Can ${action} ${subject}`,
		handler: (ability: AppAbility) => ability.can(action, subject),
	}
}

/**
 * Checks if a user satisfies all the provided policy handlers
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param handlers The policy handlers to check
 * @returns True if all policies pass, false otherwise
 */
export function checkPolicies(user: IUser, ...handlers: PolicyHandler[]): boolean {
	const ability = defineAbilityFor(user)
	return handlers.every((handler) => handler(ability))
}

/**
 * Checks if a user satisfies all the provided named policy handlers
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param handlers The named policy handlers to check
 * @returns A result object with allowed status and failed policies
 */
export function checkNamedPolicies(user: IUser, ...handlers: NamedPolicyHandler[]): PolicyCheckResult {
	const ability = defineAbilityFor(user)
	const failedPolicies: string[] = []

	handlers.forEach((namedHandler) => {
		if (!namedHandler.handler(ability)) {
			failedPolicies.push(namedHandler.name)
		}
	})

	return {
		allowed: failedPolicies.length === 0,
		failedPolicies,
	}
}

/**
 * Enforces that a user satisfies all the provided policy handlers
 *
 * @param user The user object containing role and other attributes for ABAC
 * @param handlers The policy handlers to enforce
 * @throws Error if any policy fails
 */
export function enforcePolicies(user: IUser, ...handlers: NamedPolicyHandler[]): void {
	const result = checkNamedPolicies(user, ...handlers)

	if (!result.allowed) {
		throw new Error(
			`User with role ${user.role} does not satisfy required policies: ${result.failedPolicies.join(', ')}`
		)
	}
}
