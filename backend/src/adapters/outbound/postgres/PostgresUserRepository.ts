import { Pool } from 'pg';
import { IUserRepository } from '../../../core/ports/outbound/IUserRepository';
import { User } from '../../../core/domain/entities/User';

export class PostgresUserRepository implements IUserRepository {
  constructor(private db: Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0]) : null;
  }

  async save(user: User): Promise<void> {
    await this.db.query(
      `INSERT INTO users (id, email, password_hash, role, name, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      [user.id, user.email, user.passwordHash, user.role, user.name, user.createdAt]
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  private mapToEntity(row: any): User {
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.role,
      row.name,
      new Date(row.created_at)
    );
  }
}
