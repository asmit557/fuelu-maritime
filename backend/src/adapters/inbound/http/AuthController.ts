import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../core/ports/outbound/IUserRepository';
import { User } from '../../../core/domain/entities/User';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../shared/config'; // ✅ Import shared config

export class AuthController {
  constructor(private userRepository: IUserRepository) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      await this.userRepository.updateLastLogin(user.id);

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret, // ✅ Use shared secret
        { expiresIn: config.jwt.expiresIn }
      );

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        message: 'Login successful',
        user: { email: user.email, role: user.role },
        accessToken: token,
        expiresIn: 86400
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  };

  guestLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Guest login endpoint called');
      
      let guestUser = await this.userRepository.findByEmail('guest@fueleu.com');
      
      if (!guestUser) {
        console.log('Guest user not found, creating...');
        const guestPassword = await bcrypt.hash('guest', 10);
        guestUser = new User(
          '33333333-3333-3333-3333-333333333333',
          'guest@fueleu.com',
          guestPassword,
          'guest',
          'Guest User'
        );
        await this.userRepository.save(guestUser);
        console.log('Guest user created');
      }

      const token = jwt.sign(
        { userId: guestUser.id, email: guestUser.email, role: guestUser.role },
        config.jwt.secret, // ✅ Use shared secret
        { expiresIn: config.jwt.expiresIn }
      );

      console.log('Token created with secret:', config.jwt.secret.substring(0, 10) + '...'); // Debug log

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      const responseData = {
        message: 'Guest login successful',
        user: { 
          email: guestUser.email, 
          role: guestUser.role 
        },
        accessToken: token,
        expiresIn: 86400
      };

      console.log('Sending guest login response');
      res.json(responseData);
    } catch (error) {
      console.error('Guest login error:', error);
      res.status(500).json({ 
        error: 'Guest login failed',
        details: (error as Error).message 
      });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User(uuidv4(), email, passwordHash, 'user', name);
      await this.userRepository.save(user);

      res.status(201).json({ message: 'Registration successful. Please login.' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken');
    res.json({ message: 'Logout successful' });
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.accessToken;

      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const payload = jwt.verify(token, config.jwt.secret) as any; // ✅ Use shared secret
      res.json({ valid: true, user: payload });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}
