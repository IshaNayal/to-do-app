-- Migration to add social login support to users table
ALTER TABLE users
ADD COLUMN provider VARCHAR(50) DEFAULT 'email',
ADD COLUMN provider_id VARCHAR(255),
ADD COLUMN profile_picture_url TEXT,
ADD COLUMN display_name VARCHAR(255);

-- Create unique index for provider + provider_id combinations
CREATE UNIQUE INDEX idx_users_provider_id ON users (provider, provider_id) WHERE provider != 'email';

-- Update existing users to have email provider
UPDATE users SET provider = 'email' WHERE provider IS NULL;

-- Add some sample social login users for testing
INSERT INTO users (email, password_hash, provider, provider_id, display_name, profile_picture_url)
VALUES 
  ('user@facebook.com', '', 'facebook', 'fb_123456789', 'John Doe', '/assets/images/default.svg'),
  ('user@instagram.com', '', 'instagram', 'ig_987654321', 'Jane Smith', '/assets/images/default.svg'),
  ('user@google.com', '', 'google', 'google_112233445', 'Bob Johnson', '/assets/images/default.svg');
