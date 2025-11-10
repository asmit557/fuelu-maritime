/**
 * Auth Token Value Object
 */
export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthToken {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number
  ) {}
}
