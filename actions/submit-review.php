<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/csrf.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'error' => 'Invalid request method.'], 405);
}

if (!empty($_POST['website_hp'])) {
    json_response(['success' => false, 'error' => 'Spam detected.'], 400);
}

if (!check_rate_limit('submit_review', 20, 1)) {
    json_response(['success' => false, 'error' => 'Too many review submissions. Please try again later.'], 429);
}

$name = trim($_POST['customerName'] ?? '');
$email = trim($_POST['customerEmail'] ?? '');
$rating = filter_var($_POST['rating'] ?? 0, FILTER_VALIDATE_INT);
$review_text = trim($_POST['reviewText'] ?? '');

if (empty($name) || empty($review_text) || $rating < 1 || $rating > 5) {
    json_response(['success' => false, 'error' => 'Please fill in all required fields and select a valid rating.'], 400);
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'error' => 'Invalid email format.'], 400);
}

mysqli_begin_transaction($conn);
$uploaded_files_to_cleanup = [];

try {
    $stmt = mysqli_prepare($conn, "INSERT INTO reviews (customer_name, email, rating, review_text, status) VALUES (?, ?, ?, ?, 'pending')");
    mysqli_stmt_bind_param($stmt, "ssis", $name, $email, $rating, $review_text);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception('Failed to save review to database.');
    }
    $review_id = mysqli_insert_id($conn);

    if (!empty($_FILES['reviewPhotos']['name'][0])) {
        $file_count = count($_FILES['reviewPhotos']['name']);
        if ($file_count > 3) {
            throw new Exception('Maximum 3 photos allowed.');
        }

        for ($i = 0; $i < $file_count; $i++) {
            if ($_FILES['reviewPhotos']['error'][$i] === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            $single_file = [
                'name' => $_FILES['reviewPhotos']['name'][$i],
                'type' => $_FILES['reviewPhotos']['type'][$i],
                'tmp_name' => $_FILES['reviewPhotos']['tmp_name'][$i],
                'error' => $_FILES['reviewPhotos']['error'][$i],
                'size' => $_FILES['reviewPhotos']['size'][$i]
            ];

            $upload_res = process_image_upload($single_file, UPLOAD_DIR_REVIEWS);
            if (!$upload_res['success']) {
                throw new Exception($upload_res['error']);
            }

            $filename = $upload_res['filename'];
            $uploaded_files_to_cleanup[] = UPLOAD_DIR_REVIEWS . $filename;
            $photo_path = 'uploads/reviews/' . $filename;

            $p_stmt = mysqli_prepare($conn, "INSERT INTO review_photos (review_id, photo_path) VALUES (?, ?)");
            mysqli_stmt_bind_param($p_stmt, "is", $review_id, $photo_path);
            if (!mysqli_stmt_execute($p_stmt)) {
                throw new Exception('Failed to save photo record to database.');
            }
        }
    }

    mysqli_commit($conn);
    json_response(['success' => true, 'message' => 'Review submitted successfully and awaiting moderation approval.']);

} catch (Exception $e) {
    mysqli_rollback($conn);
    // Delete any successfully uploaded image files from this attempt
    foreach ($uploaded_files_to_cleanup as $filepath) {
        if (file_exists($filepath)) {
            @unlink($filepath);
        }
    }
    json_response(['success' => false, 'error' => $e->getMessage()], 400);
}