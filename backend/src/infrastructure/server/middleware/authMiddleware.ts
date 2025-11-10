import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../../../core/domain/valueObjects/AuthToken';
import { config } from '../../../shared/config'; // ✅ Import shared config

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header OR cookie
    let token: string | undefined;
    
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('🔑 Token from Authorization header');
    }
    
    // Fallback to cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
      console.log('🍪 Token from cookie');
    }

    if (!token) {
      console.log('❌ No token found in request');
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    console.log('Verifying token with secret:', config.jwt.secret.substring(0, 10) + '...'); // Debug log

    // Verify token using shared secret
    const decoded = jwt.verify(token, config.jwt.secret) as AuthTokenPayload; // ✅ Use shared secret
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded.email);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', (error as Error).message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
