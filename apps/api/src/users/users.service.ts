import { User, UserRole } from '@enterprise/domain'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UsersService {
	// In-memory storage for users (in a real app, this would be a database)
	private readonly users: User[] = [
		new User({
			id: uuidv4(),
			username: 'admin',
			passwordHash: bcrypt.hashSync('admin', 10),
			role: UserRole.ADMIN,
		}),
		new User({
			id: uuidv4(),
			username: 'user',
			passwordHash: bcrypt.hashSync('user', 10),
			role: UserRole.USER,
		}),
	]

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username)
	}

	async findById(id: string): Promise<User | undefined> {
		return this.users.find((user) => user.id === id)
	}

	async create(username: string, password: string, role: UserRole = UserRole.USER): Promise<User> {
		const existingUser = await this.findOne(username)
		if (existingUser) {
			throw new ConflictException('Username already exists')
		}

		// Hash the password
		const passwordHash = await bcrypt.hash(password, 10)

		// Create new user
		const newUser = new User({
			id: uuidv4(),
			username,
			passwordHash,
			role,
		})

		// Save user (in a real app, this would save to a database)
		this.users.push(newUser)

		return newUser
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const userIndex = this.users.findIndex((user) => user.id === id)
		if (userIndex === -1) {
			throw new NotFoundException('User not found')
		}

		// If password is provided, hash it
		if (data.passwordHash) {
			data.passwordHash = await bcrypt.hash(data.passwordHash, 10)
		}

		// Update user
		const updatedUser = {
			...this.users[userIndex],
			...data,
		}

		// Validate user data
		User.validatePartial(updatedUser)

		// Save updated user
		this.users[userIndex] = new User(updatedUser as any)

		return this.users[userIndex]
	}

	async remove(id: string): Promise<void> {
		const userIndex = this.users.findIndex((user) => user.id === id)
		if (userIndex === -1) {
			throw new NotFoundException('User not found')
		}

		this.users.splice(userIndex, 1)
	}
}
