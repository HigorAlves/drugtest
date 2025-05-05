/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Role {
	Admin = 'admin',
	User = 'user',
	Guest = 'guest',
	Manager = 'manager',
	Editor = 'editor',
}

export enum Action {
	Manage = 'manage',
	Read = 'read',
	Create = 'create',
	Update = 'update',
	Delete = 'delete',
	Approve = 'approve',
	Reject = 'reject',
	Export = 'export',
	Import = 'import',
}

export enum Subject {
	All = 'all',
	User = 'User',
	Post = 'Post',
	Comment = 'Comment',
	Category = 'Category',
	Tag = 'Tag',
	File = 'File',
	Setting = 'Setting',
	Report = 'Report',
}

export interface IUser {
	id: string
	role: Role
	ownedResourceIds?: string[]
	departmentId?: string
	permissions?: PermissionRule[]
}

export interface PermissionRule {
	action: Action
	subject: Subject
	conditions?: Record<string, any>
	fields?: string[]
	inverted?: boolean
	reason?: string
}

export interface RBACConfig {
	roles: Record<
		string,
		{
			can: PermissionRule[]
			cannot?: PermissionRule[]
			inherits?: Role[]
		}
	>
}

export interface PolicyHandler {
	(ability: any): boolean
}
