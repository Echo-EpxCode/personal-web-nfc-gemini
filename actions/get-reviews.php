<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

// Include your database connection (check your path!)



// Your review query logic here...
require_once __DIR__ . '/../config/app.php'; // <-- Add this line here!
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

// Example check: Ensure $conn exists
if (!$conn) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 6;
$offset = ($page - 1) * $limit;

// Fetch summary stats
$summary_query = mysqli_query($conn, "SELECT COUNT(*) as total, AVG(rating) as average FROM reviews WHERE status = 'approved'");
$summary = mysqli_fetch_assoc($summary_query);
$total_approved = (int)$summary['total'];
$average_rating = $total_approved > 0 ? round((float)$summary['average'], 1) : 0.0;

// Fetch approved reviews
$stmt = mysqli_prepare($conn, "SELECT id, customer_name, rating, review_text, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT ? OFFSET ?");
mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$reviews = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rev_id = $row['id'];
    $photo_stmt = mysqli_prepare($conn, "SELECT photo_path FROM review_photos WHERE review_id = ?");
    mysqli_stmt_bind_param($photo_stmt, "i", $rev_id);
    mysqli_stmt_execute($photo_stmt);
    $photo_res = mysqli_stmt_get_result($photo_stmt);
    
    $photos = [];
    while ($p = mysqli_fetch_assoc($photo_res)) {
        $photos[] = BASE_URL . '/' . $p['photo_path'];
    }

    $reviews[] = [
        'id' => $row['id'],
        'customerName' => $row['customer_name'],
        'initials' => get_customer_initials($row['customer_name']),
        'rating' => (int)$row['rating'],
        'reviewText' => $row['review_text'],
        'createdAt' => $row['created_at'],
        'photos' => $photos
    ];
}

json_response([
    'success' => true,
    'total' => $total_approved,
    'averageRating' => $average_rating,
    'reviews' => $reviews
]);