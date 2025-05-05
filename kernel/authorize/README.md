# RBAC/ABAC Authorization System

This package provides a flexible and powerful authorization system that supports both Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).

## Key Features

- **Role-Based Access Control (RBAC)**: Permissions based on user roles
- **Attribute-Based Access Control (ABAC)**: Permissions based on attributes of users, resources, and environment
- **Role Inheritance**: Roles can inherit permissions from other roles
- **Field-Level Permissions**: Control access to specific fields of resources
- **Conditional Permissions**: Define conditions for permissions based on attributes
- **Policy Handlers**: Create reusable policy handlers for complex permission checks

## Basic Usage

### Checking Permissions

```typescript
import { checkPermission, Action, Subject } from '@shared/rbac'

// Simple RBAC check
const user = { id: '123', role: Role.User }
const result = checkPermission(user, Action.Read, Subject.Post)

if (result.allowed) {
	// User can read posts
	console.log('Access granted')
} else {
	console.log('Access denied')
}

// ABAC check with resource attributes
const post = {
	type: Subject.Post,
	id: '456',
	authorId: '123',
	title: 'Hello World',
	content: 'This is a post',
}

const result = checkPermission(user, Action.Update, post)

if (result.allowed) {
	// User can update this specific post
	console.log('Access granted')
} else {
	console.log('Access denied')
}
```

### Performing Actions

```typescript
import { performAction, Action, Subject } from '@shared/rbac'

// Perform an action if the user has permission
const user = { id: '123', role: Role.User }

try {
	const result = performAction(user, Action.Create, Subject.Comment, () => {
		// This function will only be executed if the user has permission
		return createComment('This is a comment')
	})

	console.log('Comment created:', result)
} catch (error) {
	console.error('Permission denied:', error.message)
}
```

### Filtering Fields

```typescript
import { filterFields, Action, Subject } from '@shared/rbac'

// Get only the fields the user has permission to access
const user = { id: '123', role: Role.User }
const userData = {
	id: '456',
	name: 'John Doe',
	email: 'john@example.com',
	password: 'hashed_password',
	role: Role.Admin,
	createdAt: '2023-01-01',
}

// Filter fields based on permissions
const filteredData = filterFields(user, Action.Read, {
	type: Subject.User,
	...userData,
})

// filteredData will only contain fields the user has permission to access
console.log(filteredData)
```

### Using Policy Handlers

```typescript
import { checkNamedPolicies, createPolicyHandler, Action, Subject } from '@shared/rbac'

// Create policy handlers
const canManagePosts = createPolicyHandler(Action.Manage, Subject.Post, 'Can manage all posts')

const canApproveComments = createPolicyHandler(Action.Approve, Subject.Comment, 'Can approve comments')

// Check if user satisfies all policies
const user = { id: '123', role: Role.Editor }
const result = checkNamedPolicies(user, canManagePosts, canApproveComments)

if (result.allowed) {
	console.log('User can perform all required actions')
} else {
	console.log('User cannot perform these actions:', result.failedPolicies)
}
```

## Advanced Usage

### Custom Policy Handlers

```typescript
import { AppAbility, checkPolicies } from '@shared/rbac'

// Create a custom policy handler
const canManageOwnPosts = (ability: AppAbility) => {
	return ability.can(Action.Manage, Subject.Post, { authorId: user.id })
}

// Check if user satisfies the policy
const user = { id: '123', role: Role.User }
const allowed = checkPolicies(user, canManageOwnPosts)

if (allowed) {
	console.log('User can manage their own posts')
} else {
	console.log('User cannot manage their own posts')
}
```

### Enforcing Policies

```typescript
import { enforcePolicies, createPolicyHandler, Action, Subject } from '@shared/rbac'

// Create policy handlers
const canExportReports = createPolicyHandler(Action.Export, Subject.Report, 'Can export reports')

// Enforce policies (throws error if not allowed)
const user = { id: '123', role: Role.User }

try {
	enforcePolicies(user, canExportReports)

	// This code will only execute if the user has permission
	exportReport()
} catch (error) {
	console.error('Permission denied:', error.message)
}
```

## Extending the System

### Adding Custom Roles

To add custom roles, update the Role enum in `types.ts`:

```typescript
export enum Role {
	Admin = 'admin',
	User = 'user',
	Guest = 'guest',
	// Add your custom roles here
	Moderator = 'moderator',
}
```

### Adding Custom Actions

To add custom actions, update the Action enum in `types.ts`:

```typescript
export enum Action {
	Manage = 'manage',
	Read = 'read',
	Create = 'create',
	Update = 'update',
	Delete = 'delete',
	// Add your custom actions here
	Publish = 'publish',
	Unpublish = 'unpublish',
}
```

### Adding Custom Subjects

To add custom subjects, update the Subject enum in `types.ts`:

```typescript
export enum Subject {
	All = 'all',
	User = 'User',
	Post = 'Post',
	// Add your custom subjects here
	Product = 'Product',
	Order = 'Order',
}
```

### Adding Custom Conditions

To add custom conditions, update the `transformConditions` function in `abilityFactory.ts`:

```typescript
function transformConditions(conditions: Record<string, any>, user: IUser): Record<string, any> {
	const result: Record<string, any> = {}

	Object.entries(conditions).forEach(([key, value]) => {
		switch (key) {
			// Existing conditions...

			// Add your custom condition
			case 'isInSameDepartment':
				if (value === true && user.departmentId) {
					result['departmentId'] = user.departmentId
				}
				break

			default:
				result[key] = value
		}
	})

	return result
}
```

## Best Practices

1. **Define Clear Roles**: Create roles with clear responsibilities and permissions.
2. **Use Role Inheritance**: Leverage role inheritance to avoid duplicating permissions.
3. **Prefer ABAC for Complex Rules**: Use ABAC for complex permission rules that depend on attributes.
4. **Document Permissions**: Keep your permission structure well-documented.
5. **Test Permissions**: Write tests to ensure your permission rules work as expected.
6. **Use Policy Handlers**: Create reusable policy handlers for complex permission checks.
7. **Provide Clear Error Messages**: Use the reason field to provide clear error messages.
