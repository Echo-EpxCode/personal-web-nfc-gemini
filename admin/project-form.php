<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/admin-auth.php';
require_once __DIR__ . '/../includes/functions.php';

require_admin_login();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$project = ['title' => '', 'description' => '', 'technologies' => '', 'completion_date' => '', 'source_url' => '', 'cover_image' => '', 'status' => 'Published'];
$error = '';

if ($id > 0) {
    $stmt = mysqli_prepare($conn, "SELECT * FROM projects WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    if ($row = mysqli_fetch_assoc($res)) {
        $project = $row;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $technologies = trim($_POST['technologies'] ?? '');
    $completion_date = trim($_POST['completion_date'] ?? '');
    $source_url = trim($_POST['source_url'] ?? '');
    $status = $_POST['status'] ?? 'Published';
    $cover_image = $project['cover_image'];

    if (!empty($_FILES['cover_file']['name'])) {
        $upload_res = process_image_upload($_FILES['cover_file'], UPLOAD_DIR_PROJECTS);
        if ($upload_res['success']) {
            if (!empty($cover_image) && file_exists(__DIR__ . '/../' . $cover_image)) {
                @unlink(__DIR__ . '/../' . $cover_image);
            }
            $cover_image = 'uploads/projects/' . $upload_res['filename'];
        } else {
            $error = $upload_res['error'];
        }
    }

    if (empty($error)) {
        if (empty($title) || empty($description) || empty($technologies) || empty($cover_image)) {
            $error = 'Please fill in all required fields and provide a cover image.';
        } else {
            if ($id > 0) {
                $stmt = mysqli_prepare($conn, "UPDATE projects SET title=?, description=?, technologies=?, completion_date=?, source_url=?, cover_image=?, status=? WHERE id=?");
                mysqli_stmt_bind_param($stmt, "sssssssi", $title, $description, $technologies, $completion_date, $source_url, $cover_image, $status, $id);
                mysqli_stmt_execute($stmt);
            } else {
                $max_order_res = mysqli_fetch_assoc(mysqli_query($conn, "SELECT MAX(sort_order) as max_ord FROM projects"));
                $new_order = ((int)$max_order_res['max_ord']) + 1;

                $stmt = mysqli_prepare($conn, "INSERT INTO projects (title, description, technologies, completion_date, source_url, cover_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                mysqli_stmt_bind_param($stmt, "sssssssi", $title, $description, $technologies, $completion_date, $source_url, $cover_image, $status, $new_order);
                mysqli_stmt_execute($stmt);
            }
            header('Location: index.php?tab=projects');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo $id > 0 ? 'Edit' : 'Add'; ?> Project — Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-light py-5">
    <div class="container" style="max-width: 700px;">
        <div class="card border-0 shadow-sm p-4 rounded-4">
            <h3 class="fw-bold font-heading mb-4"><?php echo $id > 0 ? 'Edit Project' : 'Add New Project'; ?></h3>
            <?php if(!empty($error)): ?><div class="alert alert-danger"><?php echo $error; ?></div><?php endif; ?>
            <form method="POST" enctype="multipart/form-data" novalidate>
                <div class="mb-3">
                    <label class="form-label fw-medium">Project Title <span class="text-danger">*</span></label>
                    <input type="text" name="title" class="form-control" value="<?php echo sanitize_input($project['title']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-medium">Description <span class="text-danger">*</span></label>
                    <textarea name="description" class="form-control" rows="3" required><?php echo sanitize_input($project['description']); ?></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-medium">Technologies <span class="text-danger">*</span></label>
                    <input type="text" name="technologies" class="form-control" value="<?php echo sanitize_input($project['technologies']); ?>" placeholder="PHP, MySQL, Bootstrap 5" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-medium">Completion Date</label>
                        <input type="text" name="completion_date" class="form-control" value="<?php echo sanitize_input($project['completion_date']); ?>" placeholder="October 2026">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-medium">Status</label>
                        <select name="status" class="form-select">
                            <option value="Published" <?php echo $project['status']==='Published'?'selected':''; ?>>Published</option>
                            <option value="Draft" <?php echo $project['status']==='Draft'?'selected':''; ?>>Draft</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-medium">Source Code URL</label>
                    <input type="url" name="source_url" class="form-control" value="<?php echo sanitize_input($project['source_url']); ?>" placeholder="https://github.com/...">
                </div>
                <div class="mb-4">
                    <label class="form-label fw-medium">Cover Image <?php echo empty($project['cover_image']) ? '<span class="text-danger">*</span>' : ''; ?></label>
                    <?php if(!empty($project['cover_image'])): ?>
                        <div class="mb-2"><img src="../<?php echo $project['cover_image']; ?>" class="rounded border" style="width: 100px; height: 70px; object-fit: cover;"></div>
                    <?php endif; ?>
                    <input type="file" name="cover_file" class="form-control" accept="image/jpeg,image/jpg" <?php echo empty($project['cover_image']) ? 'required' : ''; ?>>
                </div>
                <div class="text-end">
                    <a href="index.php?tab=projects" class="btn btn-secondary me-2">Cancel</a>
                    <button type="submit" class="btn btn-primary">Save Project</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>