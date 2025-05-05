import { z } from 'zod';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  passwordHash: z.string().min(1, { message: "Password hash is required" }),
  role: z.nativeEnum(UserRole, { 
    errorMap: () => ({ message: "Role must be either ADMIN or USER" }) 
  }),
});

export type UserType = z.infer<typeof UserSchema>;

export class User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;

  constructor(data: UserType) {
    const validatedData = UserSchema.parse(data);
    this.id = validatedData.id;
    this.username = validatedData.username;
    this.passwordHash = validatedData.passwordHash;
    this.role = validatedData.role;
  }

  static validate(user: unknown): UserType {
    return UserSchema.parse(user);
  }

  static validatePartial(user: unknown): Partial<UserType> {
    return UserSchema.partial().parse(user);
  }
}
