/**
 * User Entity - Authentication domain model
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: 'admin' | 'user' | 'guest',
    public readonly name: string,
    public readonly createdAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!this.passwordHash) {
      throw new Error('Password hash is required');
    }
  }

  public isGuest(): boolean {
    return this.role === 'guest';
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }
}
