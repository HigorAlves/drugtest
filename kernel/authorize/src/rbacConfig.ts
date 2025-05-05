import { Action, RBACConfig as RBACConfigType, Role, Subject } from './types'

/**
 * RBAC Configuration with ABAC capabilities
 *
 * This configuration defines the permissions for each role in the system.
 * It supports both Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).
 *
 * RBAC: Permissions are assigned based on the user's role.
 * ABAC: Permissions can be further refined based on attributes of the user, resource, or environment.
 *
 * Key features:
 * - Role inheritance: Roles can inherit permissions from other roles
 * - Conditions: Permissions can be conditional based on attributes
 * - Field-level permissions: Access can be restricted to specific fields
 * - Inverted rules: Rules can be inverted to deny access
 */
export const RBACConfig: RBACConfigType = {
	roles: {
		[Role.Admin]: {
			can: [{ action: Action.Manage, subject: Subject.All }],
		},
		[Role.Manager]: {
			can: [
				{ action: Action.Read, subject: Subject.All },
				{ action: Action.Create, subject: Subject.All },
				{ action: Action.Update, subject: Subject.All },
				{ action: Action.Delete, subject: Subject.All, conditions: { exceptOwnAccount: true } },
				{ action: Action.Approve, subject: Subject.All },
				{ action: Action.Reject, subject: Subject.All },
				{ action: Action.Export, subject: Subject.Report },
			],
			cannot: [
				{ action: Action.Delete, subject: Subject.User, conditions: { isAdmin: true } },
				{ action: Action.Update, subject: Subject.Setting, conditions: { isGlobal: true } },
			],
		},
		[Role.Editor]: {
			can: [
				{ action: Action.Read, subject: Subject.All },
				{ action: Action.Create, subject: Subject.Post },
				{ action: Action.Create, subject: Subject.Comment },
				{ action: Action.Update, subject: Subject.Post, conditions: { isAuthor: true } },
				{ action: Action.Update, subject: Subject.Comment, conditions: { isAuthor: true } },
				{ action: Action.Delete, subject: Subject.Post, conditions: { isAuthor: true } },
				{ action: Action.Delete, subject: Subject.Comment, conditions: { isAuthor: true } },
			],
			inherits: [Role.User],
		},
		[Role.User]: {
			can: [
				{ action: Action.Read, subject: Subject.All },
				{ action: Action.Create, subject: Subject.Comment },
				{
					action: Action.Update,
					subject: Subject.User,
					conditions: { isOwner: true },
					fields: ['name', 'email', 'avatar'],
				},
				{ action: Action.Delete, subject: Subject.Comment, conditions: { isAuthor: true } },
			],
			cannot: [
				{ action: Action.Delete, subject: Subject.User },
				{ action: Action.Read, subject: Subject.Setting, conditions: { isPrivate: true } },
			],
		},
		[Role.Guest]: {
			can: [
				{ action: Action.Read, subject: Subject.Post },
				{ action: Action.Read, subject: Subject.Comment },
				{ action: Action.Read, subject: Subject.Category },
				{ action: Action.Read, subject: Subject.Tag },
			],
		},
	},
}
