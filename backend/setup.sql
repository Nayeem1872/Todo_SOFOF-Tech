-- Create database
CREATE DATABASE IF NOT EXISTS todo_db;

-- Use the database
USE todo_db;

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('PENDING', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO todos (id, title, description, status) VALUES
  (UUID(), 'Sample Todo 1', 'This is a sample todo', 'PENDING'),
  (UUID(), 'Sample Todo 2', 'Another sample todo', 'IN_PROGRESS'),
  (UUID(), 'Sample Todo 3', 'Completed sample todo', 'DONE');
