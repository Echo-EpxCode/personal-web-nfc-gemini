
<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Database Environment
|--------------------------------------------------------------------------
|
| Use 'local' for development on your computer.
| Use 'production' for your live hosting server.
|
*/

$environment = 'production';
// Change to 'production' when deploying.
// chore(database): switch to production configuration
// chore(database): switch to local configuration

/*
|--------------------------------------------------------------------------
| Database Configuration
|--------------------------------------------------------------------------
*/

$databaseConfigs = [
    'local' => [
        'host' => 'localhost',
        'username' => 'root',
        'database' => 'portfolio_db',
        'password' => '',
    ],

    'production' => [
        'host' => 'sql311.infinityfree.com',
        'username' => 'if0_43159198',
        'database' => 'if0_43159198_portfolio_db',
    ],
];

/*
|--------------------------------------------------------------------------
| Select Database Configuration
|--------------------------------------------------------------------------
*/

if (!isset($databaseConfigs[$environment])) {
    error_log('Invalid database environment configured.');
    die('Database connection error. Please try again later.');
}

$dbConfig = $databaseConfigs[$environment];

$db_host = $dbConfig['host'];
$db_user = $dbConfig['username'];
$db_name = $dbConfig['database'];
$db_pass = $dbConfig['password'] ?? '';

/*
|--------------------------------------------------------------------------
| Load Production Password
|--------------------------------------------------------------------------
|
| Priority:
| 1. DB_PASSWORD environment variable
| 2. Local, untracked db-secrets.php file
|
*/

if ($environment === 'production') {
    $envPassword = getenv('DB_PASSWORD');

    if ($envPassword !== false && $envPassword !== '') {
        $db_pass = $envPassword;
    } else {
        $secretsFile = __DIR__ . '/db-secrets.php';

        if (is_file($secretsFile)) {
            $secrets = require $secretsFile;
            $db_pass = $secrets['password'] ?? '';
        }
    }

    if ($db_pass === '') {
        error_log('Production database password is not configured.');
        die('Database connection error. Please try again later.');
    }
}

/*
|--------------------------------------------------------------------------
| Connect to Database
|--------------------------------------------------------------------------
*/

$conn = mysqli_connect(
    $db_host,
    $db_user,
    $db_pass,
    $db_name
);

if (!$conn) {
    error_log('Database connection failed: ' . mysqli_connect_error());
    die('Database connection error. Please try again later.');
}

if (!mysqli_set_charset($conn, 'utf8mb4')) {
    error_log('Failed to configure database character set.');
    mysqli_close($conn);
    die('Database connection error. Please try again later.');
}
