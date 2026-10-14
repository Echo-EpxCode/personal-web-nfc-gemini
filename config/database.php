<?php
$db_host = 'sql311.infinityfree.com';
$db_user = 'if0_43159198';
$db_pass = 'Tz8huL1011';
$db_name = 'if0_43159198_portfolio_db';

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Database connection error. Please try again later.");
}

mysqli_set_charset($conn, 'utf8mb4');