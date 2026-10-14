<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 6;
$offset = ($page - 1) * $limit;

$stmt = mysqli_prepare($conn, "SELECT id, title, description, technologies, completion_date, source_url, cover_image FROM projects WHERE status = 'Published' ORDER BY sort_order ASC, id DESC LIMIT ? OFFSET ?");
mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$projects = [];
while ($row = mysqli_fetch_assoc($result)) {
    $row['cover_image'] = BASE_URL . '/' . $row['cover_image'];
    $projects[] = $row;
}

json_response(['success' => true, 'projects' => $projects]);