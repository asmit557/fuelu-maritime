import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../ports/outbound/IUserRepository';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Validate password strength
    if (input.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Create user
    const user = new User(
      uuidv4(),
      input.email,
      passwordHash,
      'user',
      input.name
    );

    await this.userRepository.save(user);
    return user;
  }
}
