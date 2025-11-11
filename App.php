<?php
// Initialize application and security settings
define('SECURE_ACCESS', true);
require_once 'includes/security.php';

// Initialize security instance
$security = Security::getInstance();

// Error reporting in production
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Database configuration (update with your credentials)
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'your_database');

// Application constants
define('APP_NAME', 'Ansum Solutions');
define('APP_URL', 'https://your-domain.com'); // Update with your domain
define('APP_VERSION', '1.0.0');

// Session timeout in seconds (30 minutes)
define('SESSION_TIMEOUT', 1800);

// Rate limiting settings
define('RATE_LIMIT_ATTEMPTS', 5);
define('RATE_LIMIT_TIMEOUT', 900); // 15 minutes

class App {
    private $db;
    private $security;

    public function __construct() {
        $this->security = Security::getInstance();
        $this->initializeDatabase();
        $this->checkRateLimit();
    }

    private function initializeDatabase() {
        try {
            $this->db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            if ($this->db->connect_error) {
                throw new Exception('Database connection failed');
            }
            $this->db->set_charset('utf8mb4');
        } catch (Exception $e) {
            $this->security->logSecurityEvent("Database connection error: " . $e->getMessage(), 'error');
            die('Service temporarily unavailable');
        }
    }

    private function checkRateLimit() {
        $client_ip = $_SERVER['REMOTE_ADDR'];
        $current_time = time();
        
        if (!isset($_SESSION['rate_limit'])) {
            $_SESSION['rate_limit'] = [
                'attempts' => 0,
                'first_attempt' => $current_time
            ];
        }

        // Reset rate limit if timeout has passed
        if (($current_time - $_SESSION['rate_limit']['first_attempt']) > RATE_LIMIT_TIMEOUT) {
            $_SESSION['rate_limit'] = [
                'attempts' => 0,
                'first_attempt' => $current_time
            ];
        }

        // Increment attempts
        $_SESSION['rate_limit']['attempts']++;

        // Check if limit exceeded
        if ($_SESSION['rate_limit']['attempts'] > RATE_LIMIT_ATTEMPTS) {
            $this->security->logSecurityEvent("Rate limit exceeded for IP: $client_ip", 'warning');
            http_response_code(429);
            die('Too many requests. Please try again later.');
        }
    }

    public function processFormSubmission($data) {
        // Validate CSRF token
        if (!$this->security->validateCsrfToken($data['csrf_token'] ?? '')) {
            $this->security->logSecurityEvent('Invalid CSRF token detected', 'warning');
            return ['success' => false, 'message' => 'Invalid request'];
        }

        // Sanitize input data
        $clean_data = $this->security->sanitizeInput($data);

        // Validate required fields
        $required_fields = ['name', 'email', 'message'];
        if (!$this->security->validateRequiredFields($clean_data, $required_fields)) {
            return ['success' => false, 'message' => 'Please fill all required fields'];
        }

        // Validate email
        if (!$this->security->validateEmail($clean_data['email'])) {
            return ['success' => false, 'message' => 'Invalid email address'];
        }

        try {
            // Process the form data (example using prepared statement)
            $stmt = $this->db->prepare("INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $clean_data['name'], $clean_data['email'], $clean_data['message']);
            
            if ($stmt->execute()) {
                $this->security->logSecurityEvent("New contact form submission from: {$clean_data['email']}", 'info');
                return ['success' => true, 'message' => 'Message sent successfully'];
            } else {
                throw new Exception('Failed to save submission');
            }
        } catch (Exception $e) {
            $this->security->logSecurityEvent("Form submission error: " . $e->getMessage(), 'error');
            return ['success' => false, 'message' => 'An error occurred. Please try again later.'];
        }
    }

    public function __destruct() {
        if (isset($this->db)) {
            $this->db->close();
        }
    }
}

// Initialize the application
$app = new App();
?>
