-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Insert default users
INSERT INTO users (id, email, password_hash, role, name) VALUES
-- Password: admin123
('11111111-1111-1111-1111-111111111111', 'admin@fueleu.com', '$2a$10$8K1p/a0dL3LKzao1CAwcM.HvgqnRVJgWOCEh0GhQKqSzYXQgBj3gK', 'admin', 'Admin User'),
-- Password: demo123
('22222222-2222-2222-2222-222222222222', 'demo@fueleu.com', '$2a$10$Wz6kN4IqXLBmXc8QGHWtg.ykKEH7KvZDLBdYH9Z5kfWvQqgLsEv5i', 'user', 'Demo User'),
-- Password: guest (auto-generated)
('33333333-3333-3333-3333-333333333333', 'guest@fueleu.com', '$2a$10$rXKHGhGNVb6gKQqOkJ7EauBW6pQw5C5VvH5Hq9g5oBk5FxR7LCVpC', 'guest', 'Guest User')
ON CONFLICT (email) DO NOTHING;
