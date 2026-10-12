<?php
// Dynamic Base URL detection for Laravel Herd, XAMPP, and production hosting
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
// Automatically extract the root project folder path
$base_dir = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\');
define('BASE_URL', $protocol . '://' . $host . $base_dir);

define('UPLOAD_DIR_PROJECTS', __DIR__ . '/../uploads/projects/');
define('UPLOAD_DIR_REVIEWS', __DIR__ . '/../uploads/reviews/');

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}