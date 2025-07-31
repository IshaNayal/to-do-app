-- Migration to create users and todos tables for the to-do list app
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_is_done ON todos(is_done);

-- Insert test user for MVP (email: test@example.com, password: 123456)
INSERT INTO users (email, password_hash) VALUES 
('test@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye.gkKDkG2I2z');
