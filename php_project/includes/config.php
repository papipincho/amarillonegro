<?php
/**
 * Database Configuration
 * Modifica estos valores con los datos de tu hosting
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'amarillonegro_db');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');

// Admin password
define('ADMIN_PASSWORD', 'Amarillonegro1?');

// Email configuration (Resend - opcional)
define('RESEND_API_KEY', '');
define('NOTIFICATION_EMAIL', 'info@taxis.cat');

// Site URL (sin barra final)
define('SITE_URL', 'https://amarillonegro.com');

/**
 * Database connection
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}

/**
 * Initialize database tables
 */
function initDatabase() {
    $pdo = getDBConnection();
    if (!$pdo) return false;
    
    try {
        // Newsletter subscriptions
        $pdo->exec("CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(50),
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        // Contact submissions
        $pdo->exec("CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            service_category VARCHAR(100) NOT NULL,
            business_name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            website VARCHAR(500),
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        return true;
    } catch (PDOException $e) {
        error_log("Database init error: " . $e->getMessage());
        return false;
    }
}
