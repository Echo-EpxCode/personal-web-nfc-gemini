
<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Database Environment
|--------------------------------------------------------------------------
|
| Use 'local' for development.
| Use 'production' for your hosted website.
|
*/

$environment = 'production';

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
| Select Configuration
|--------------------------------------------------------------------------
*/

if (!isset($databaseConfigs[$environment])) {
    error_log('Invalid database environment: ' . $environment);
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
*/

if ($environment === 'production') {
    $envPassword = getenv('DB_PASSWORD');

    if ($envPassword !== false && $envPassword !== '') {
        $db_pass = $envPassword;
    } else {
        $secretsFile = __DIR__ . '/db-secrets.php';

        if (!is_file($secretsFile)) {
            error_log('Production database secrets file is missing.');
            die('Database connection error. Please try again later.');
        }

        try {
            $secrets = require $secretsFile;
        } catch (Throwable $e) {
            error_log('Failed to load database secrets: ' . $e->getMessage());
            die('Database connection error. Please try again later.');
        }

        if (!is_array($secrets)) {
            error_log('Database secrets file must return an array.');
            die('Database connection error. Please try again later.');
        }

        $db_pass = $secrets['password'] ?? '';
    }

    if (!is_string($db_pass) || $db_pass === '') {
        error_log('Production database password is missing or invalid.');
        die('Database connection error. Please try again later.');
    }
}

/*
|--------------------------------------------------------------------------
| Connect to Database
|--------------------------------------------------------------------------
*/

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect(
        $db_host,
        $db_user,
        $db_pass,
        $db_name
    );

    mysqli_set_charset($conn, 'utf8mb4');

} catch (mysqli_sql_exception $e) {
    error_log(
        'Database connection or configuration failed [' .
        $environment . ']: ' . $e->getMessage()
    );

    if (isset($conn) && $conn instanceof mysqli) {
        mysqli_close($conn);
    }

    die('Database connection error. Please try again later.');
}
