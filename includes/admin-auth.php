<?php
require_once __DIR__ . '/../config/app.php';

function require_admin_login() {
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: ' . BASE_URL . '/admin/login.php');
        exit;
    }
}