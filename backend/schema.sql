-- ============================================
-- AmarilloNegro.com - Database Schema for MySQL
-- ============================================
-- Execute this script in your MySQL hosting to create the necessary tables
-- 
-- Usage: mysql -u your_user -p your_database < schema.sql
-- ============================================

-- Create database if not exists (optional, your hosting might have one)
-- CREATE DATABASE IF NOT EXISTS amarillonegro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE amarillonegro_db;

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_subscribed_at (subscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact/Service submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_category VARCHAR(100) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    website VARCHAR(500),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (service_category),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services directory table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(500),
    address VARCHAR(500),
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- End of schema
-- ============================================
