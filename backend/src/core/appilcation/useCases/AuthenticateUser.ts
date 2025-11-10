import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { AuthToken, AuthTokenPayload } from '../../domain/valueObjects/AuthToken';
import { IUserRepository } from '../../ports/outbound/IUserRepository';
import { config } from '../../../shared/config'; // ✅ Import shared config

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthenticateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: LoginInput): Promise<AuthToken> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    await this.userRepository.updateLastLogin(user.id);
    return this.generateTokens(user);
  }

  async guestLogin(): Promise<AuthToken> {
    let guestUser = await this.userRepository.findByEmail('guest@fueleu.com');
    
    if (!guestUser) {
      const guestPassword = await bcrypt.hash('guest', 10);
      const { v4: uuidv4 } = require('uuid');
      guestUser = new User(
        uuidv4(),
        'guest@fueleu.com',
        guestPassword,
        'guest',
        'Guest User'
      );
      await this.userRepository.save(guestUser);
    }

    return this.generateTokens(guestUser);
  }

  private generateTokens(user: User): AuthToken {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, { // ✅ Use shared secret
      expiresIn: config.jwt.expiresIn
    });

    const refreshToken = jwt.sign(payload, config.jwt.secret, { // ✅ Use shared secret
      expiresIn: config.jwt.refreshExpiresIn
    });

    return new AuthToken(accessToken, refreshToken, 24 * 60 * 60);
  }

  async verifyToken(token: string): Promise<AuthTokenPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthTokenPayload; // ✅ Use shared secret
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
