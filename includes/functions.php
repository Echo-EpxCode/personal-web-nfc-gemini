<?php
require_once __DIR__ . '/../config/database.php';

function sanitize_input($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function json_response(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode($data);
    exit;
}

function get_customer_initials($name) {
    $words = explode(' ', trim($name));
    $initials = '';
    foreach ($words as $w) {
        if (!empty($w)) {
            $initials .= mb_substr($w, 0, 1);
        }
    }
    return mb_strtoupper(mb_substr($initials, 0, 2));
}

function process_image_upload($file, $target_dir) {
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['success' => false, 'error' => 'Invalid upload parameters.'];
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive.',
            UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive.',
            UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded.',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
            UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload.'
        ];
        return ['success' => false, 'error' => $upload_errors[$file['error']] ?? 'Unknown upload error.'];
    }

    if ($file['size'] > 10 * 1024 * 1024) {
        return ['success' => false, 'error' => 'File exceeds 10MB size limit.'];
    }

    // Use native getimagesize() instead of finfo to prevent missing extension fatal errors
    $image_info = @getimagesize($file['tmp_name']);
    if ($image_info === false) {
        return ['success' => false, 'error' => 'The uploaded file is not a valid image.'];
    }

    $mime = $image_info['mime'] ?? '';
    $allowed_mimes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png'];
    if (!in_array($mime, $allowed_mimes)) {
        return ['success' => false, 'error' => 'Only JPEG and PNG images are allowed.'];
    }

    $extension = 'jpg';
    $new_filename = bin2hex(random_bytes(16)) . '.' . $extension;
    
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            return ['success' => false, 'error' => 'Failed to create upload directory on server.'];
        }
    }

    $destination = $target_dir . $new_filename;

    // Create GD image resource based on file type
    $image = false;
    if ($mime === 'image/png') {
        $image = @imagecreatefrompng($file['tmp_name']);
        if ($image) {
            $width = imagesx($image);
            $height = imagesy($image);
            $true_img = imagecreatetruecolor($width, $height);
            $white = imagecolorallocate($true_img, 255, 255, 255);
            imagefill($true_img, 0, 0, $white);
            imagecopy($true_img, $image, 0, 0, 0, 0, $width, $height);
            imagedestroy($image);
            $image = $true_img;
        }
    } else {
        $image = @imagecreatefromjpeg($file['tmp_name']);
    }

    if (!$image) {
        return ['success' => false, 'error' => 'Could not process image file. It may be corrupted.'];
    }

    $width = imagesx($image);
    $height = imagesy($image);
    $max_dim = 1600;

    if ($width > $max_dim || $height > $max_dim) {
        if ($width > $height) {
            $new_w = $max_dim;
            $new_h = (int)($height * ($max_dim / $width));
        } else {
            $new_h = $max_dim;
            $new_w = (int)($width * ($max_dim / $height));
        }
        $tmp_img = imagecreatetruecolor($new_w, $new_h);
        $white = imagecolorallocate($tmp_img, 255, 255, 255);
        imagefill($tmp_img, 0, 0, $white);
        imagecopyresampled($tmp_img, $image, 0, 0, 0, 0, $new_w, $new_h, $width, $height);
        imagedestroy($image);
        $image = $tmp_img;
    }

    if (imagejpeg($image, $destination, 85)) {
        imagedestroy($image);
        return ['success' => true, 'filename' => $new_filename];
    }

    imagedestroy($image);
    return ['success' => false, 'error' => 'Failed to save optimized image on server.'];
}

function check_rate_limit($action_type, $max_attempts = 5, $decay_minutes = 15) {
    global $conn;
    $identifier = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $hash = hash('sha256', $identifier . $action_type);

    $stmt = mysqli_prepare($conn, "SELECT attempt_count, last_attempt FROM rate_limits WHERE identifier_hash = ? AND action_type = ?");
    mysqli_stmt_bind_param($stmt, "ss", $hash, $action_type);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $now = time();
    if ($row = mysqli_fetch_assoc($result)) {
        $last_time = strtotime($row['last_attempt']);
        if (($now - $last_time) > ($decay_minutes * 60)) {
            $stmt_reset = mysqli_prepare($conn, "UPDATE rate_limits SET attempt_count = 1, last_attempt = NOW() WHERE identifier_hash = ? AND action_type = ?");
            mysqli_stmt_bind_param($stmt_reset, "ss", $hash, $action_type);
            mysqli_stmt_execute($stmt_reset);
            return true;
        }
        if ($row['attempt_count'] >= $max_attempts) {
            return false;
        }
        $stmt_inc = mysqli_prepare($conn, "UPDATE rate_limits SET attempt_count = attempt_count + 1, last_attempt = NOW() WHERE identifier_hash = ? AND action_type = ?");
        mysqli_stmt_bind_param($stmt_inc, "ss", $hash, $action_type);
        mysqli_stmt_execute($stmt_inc);
        return true;
    } else {
        $stmt_ins = mysqli_prepare($conn, "INSERT INTO rate_limits (identifier_hash, action_type, attempt_count) VALUES (?, ?, 1)");
        mysqli_stmt_bind_param($stmt_ins, "ss", $hash, $action_type);
        mysqli_stmt_execute($stmt_ins);
        return true;
    }
}