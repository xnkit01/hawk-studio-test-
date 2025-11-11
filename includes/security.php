<?php
// Security Configuration File

// Prevent direct access to this file
if (!defined('SECURE_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access to this file is not allowed.');
}

class Security {
    private static $instance = null;
    private $csrfToken;

    private function __construct() {
        // Start secure session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            $this->secureSessionStart();
        }
        
        // Generate CSRF token if not exists
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        $this->csrfToken = $_SESSION['csrf_token'];

        // Set security headers
        $this->setSecurityHeaders();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Security();
        }
        return self::$instance;
    }

    private function secureSessionStart() {
        // Set secure session parameters
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', 1);
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.use_strict_mode', 1);
        ini_set('session.use_only_cookies', 1);
        
        session_start();

        // Regenerate session ID periodically
        if (!isset($_SESSION['created'])) {
            $_SESSION['created'] = time();
        } else if (time() - $_SESSION['created'] > 1800) { // 30 minutes
            session_regenerate_id(true);
            $_SESSION['created'] = time();
        }
    }

    private function setSecurityHeaders() {
        // Set essential security headers
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com");
    }

    public function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeInput'], $data);
        }
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    public function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public function getCsrfToken() {
        return $this->csrfToken;
    }

    public function validateCsrfToken($token) {
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    public function validateRequiredFields($data, $required_fields) {
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                return false;
            }
        }
        return true;
    }

    public function preventSQLInjection($string) {
        // Use if not using prepared statements
        if (function_exists('mysqli_real_escape_string')) {
            global $db_connection; // Assuming you have a database connection
            return mysqli_real_escape_string($db_connection, $string);
        }
        return addslashes($string);
    }

    public function isValidFileUpload($file, $allowed_types = ['jpg', 'jpeg', 'png', 'pdf'], $max_size = 5242880) {
        if (!isset($file['error']) || is_array($file['error'])) {
            return false;
        }

        // Check file size (default 5MB)
        if ($file['size'] > $max_size) {
            return false;
        }

        // Check MIME type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $finfo->file($file['tmp_name']);
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        return in_array($ext, $allowed_types);
    }

    public function generateSecurePassword($length = 12) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?';
        return substr(str_shuffle($chars), 0, $length);
    }

    public function hashPassword($password) {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);
    }

    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public function logSecurityEvent($event, $severity = 'info') {
        $log_file = __DIR__ . '/security.log';
        $timestamp = date('Y-m-d H:i:s');
        $client_ip = $_SERVER['REMOTE_ADDR'];
        $log_entry = "[$timestamp] [$severity] [$client_ip] $event\n";
        error_log($log_entry, 3, $log_file);
    }
}
?>