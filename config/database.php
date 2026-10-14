<?php
$db_host = 'sql311.infinityfree.com';
$db_user = 'if0_43159198';
$db_pass = getenv('DB_PASSWORD');
$db_name = 'if0_43159198_XXX';

if ($db_pass === false || $db_pass === '') {
    error_log('Database password is not configured.');
    die("Database connection error. Please try again later.");
}

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Database connection error. Please try again later.");
}

mysqli_set_charset($conn, 'utf8mb4');