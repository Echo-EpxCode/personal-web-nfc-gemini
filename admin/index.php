<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php'; // <-- Add this line here
require_once __DIR__ . '/../includes/admin-auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_admin_login();

// Fetch summary metrics
$res_total = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as cnt FROM reviews"))['cnt'];
$res_pending = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as cnt FROM reviews WHERE status='pending'"))['cnt'];
$res_approved = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as cnt FROM reviews WHERE status='approved'"))['cnt'];
$res_rejected = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as cnt FROM reviews WHERE status='rejected'"))['cnt'];

// Handle Review Actions
if (isset($_GET['action']) && isset($_GET['id'])) {
    $r_id = (int)$_GET['id'];
    $action = $_GET['action'];

    if ($action === 'approve') {
        mysqli_query($conn, "UPDATE reviews SET status='approved' WHERE id=$r_id");
        header('Location: index.php?tab=reviews');
        exit;
    } elseif ($action === 'reject' || $action === 'delete_review') {
        // Fetch photos to delete from filesystem
        $p_res = mysqli_query($conn, "SELECT photo_path FROM review_photos WHERE review_id=$r_id");
        while ($p = mysqli_fetch_assoc($p_res)) {
            if (file_exists(__DIR__ . '/../' . $p['photo_path'])) {
                @unlink(__DIR__ . '/../' . $p['photo_path']);
            }
        }
        mysqli_query($conn, "DELETE FROM reviews WHERE id=$r_id");
        header('Location: index.php?tab=reviews');
        exit;
    }
}

// Handle Project Actions (Delete)
if (isset($_GET['delete_project'])) {
    $p_id = (int)$_GET['delete_project'];
    $p_row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT cover_image FROM projects WHERE id=$p_id"));
    if ($p_row && file_exists(__DIR__ . '/../' . $p_row['cover_image'])) {
        @unlink(__DIR__ . '/../' . $p_row['cover_image']);
    }
    mysqli_query($conn, "DELETE FROM projects WHERE id=$p_id");
    header('Location: index.php?tab=projects');
    exit;
}

// Handle Project Reordering
if (isset($_GET['move']) && isset($_GET['pid'])) {
    $pid = (int)$_GET['pid'];
    $direction = $_GET['move'];
    $current = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, sort_order FROM projects WHERE id=$pid"));
    
    if ($current) {
        $curr_order = (int)$current['sort_order'];
        if ($direction === 'up') {
            $target = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, sort_order FROM projects WHERE sort_order < $curr_order ORDER BY sort_order DESC LIMIT 1"));
        } else {
            $target = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id, sort_order FROM projects WHERE sort_order > $curr_order ORDER BY sort_order ASC LIMIT 1"));
        }
        
        if ($target) {
            $target_id = (int)$target['id'];
            $target_order = (int)$target['sort_order'];
            mysqli_query($conn, "UPDATE projects SET sort_order = $target_order WHERE id = $pid");
            mysqli_query($conn, "UPDATE projects SET sort_order = $curr_order WHERE id = $target_id");
        }
    }
    header('Location: index.php?tab=projects');
    exit;
}

$active_tab = $_GET['tab'] ?? 'overview';
$reviews_result = mysqli_query($conn, "SELECT * FROM reviews ORDER BY created_at DESC");
$projects_result = mysqli_query($conn, "SELECT * FROM projects ORDER BY sort_order ASC, id DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard — Portfolio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body class="bg-light">
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <nav class="col-md-3 col-lg-2 d-md-block bg-surface border-end sidebar collapse px-0">
                <div class="position-sticky pt-4 px-3">
                    <a href="index.php" class="d-flex align-items-center mb-3 text-dark text-decoration-none">
                        <span class="fs-5 fw-bold font-heading"><span class="text-primary">Admin</span> Panel</span>
                    </a>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto gap-1">
                        <li class="nav-item"><a href="index.php?tab=overview" class="nav-link <?php echo $active_tab==='overview'?'active':''; ?>"><i class="bi bi-speedometer2 me-2"></i> Overview</a></li>
                        <li><a href="index.php?tab=reviews" class="nav-link d-flex justify-content-between align-items-center <?php echo $active_tab==='reviews'?'active':''; ?>"><span><i class="bi bi-star me-2"></i> Reviews</span><span class="badge bg-danger rounded-pill"><?php echo $res_pending; ?></span></a></li>
                        <li><a href="index.php?tab=projects" class="nav-link <?php echo $active_tab==='projects'?'active':''; ?>"><i class="bi bi-briefcase me-2"></i> Projects</a></li>
                    </ul>
                    <hr>
                    <a href="logout.php" class="btn btn-outline-danger w-100 btn-sm"><i class="bi bi-box-arrow-right me-2"></i>Logout</a>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                <?php if ($active_tab === 'overview'): ?>
                    <h1 class="h2 fw-bold font-heading mb-4">Dashboard Overview</h1>
                    <div class="row g-4">
                        <div class="col-md-3"><div class="card p-4 border-0 shadow-sm stat-card"><h6 class="text-muted">Total Reviews</h6><h3 class="fw-bold"><?php echo $res_total; ?></h3></div></div>
                        <div class="col-md-3"><div class="card p-4 border-0 shadow-sm stat-card border-warning"><h6 class="text-muted">Pending Reviews</h6><h3 class="fw-bold text-warning"><?php echo $res_pending; ?></h3></div></div>
                        <div class="col-md-3"><div class="card p-4 border-0 shadow-sm stat-card border-success"><h6 class="text-muted">Approved Reviews</h6><h3 class="fw-bold text-success"><?php echo $res_approved; ?></h3></div></div>
                        <div class="col-md-3"><div class="card p-4 border-0 shadow-sm stat-card border-danger"><h6 class="text-muted">Rejected Reviews</h6><h3 class="fw-bold text-danger"><?php echo $res_rejected; ?></h3></div></div>
                    </div>
                <?php elseif ($active_tab === 'reviews'): ?>
                    <h1 class="h2 fw-bold font-heading mb-4">Review Moderation</h1>
                    <div class="card border-0 shadow-sm p-4 rounded-4">
                        <div class="table-responsive">
                            <table class="table align-middle">
                                <thead class="table-light">
                                    <tr><th>Customer</th><th>Rating</th><th>Review Text</th><th>Status</th><th class="text-end">Actions</th></tr>
                                </thead>
                                <tbody>
                                    <?php while($r = mysqli_fetch_assoc($reviews_result)): ?>
                                    <tr>
                                        <td><strong><?php echo sanitize_input($r['customer_name']); ?></strong><br><small class="text-muted"><?php echo sanitize_input($r['email']); ?></small></td>
                                        <td><?php echo $r['rating']; ?> <i class="bi bi-star-fill text-warning"></i></td>
                                        <td><span class="text-truncate d-inline-block" style="max-width: 250px;">"<?php echo sanitize_input($r['review_text']); ?>"</span></td>
                                        <td><span class="badge text-uppercase bg-<?php echo $r['status']==='approved'?'success':($r['status']==='pending'?'warning text-dark':'danger'); ?>"><?php echo $r['status']; ?></span></td>
                                        <td class="text-end">
                                            <?php if($r['status'] !== 'approved'): ?><a href="index.php?tab=reviews&action=approve&id=<?php echo $r['id']; ?>" class="btn btn-sm btn-outline-success me-1" title="Approve"><i class="bi bi-check-lg"></i></a><?php endif; ?>
                                            <?php if($r['status'] !== 'rejected'): ?><a href="index.php?tab=reviews&action=reject&id=<?php echo $r['id']; ?>" class="btn btn-sm btn-outline-warning me-1" title="Reject"><i class="bi bi-x-lg"></i></a><?php endif; ?>
                                            <a href="index.php?tab=reviews&action=delete_review&id=<?php echo $r['id']; ?>" class="btn btn-sm btn-outline-danger" title="Delete"><i class="bi bi-trash"></i></a>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <?php elseif ($active_tab === 'projects'): ?>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="h2 fw-bold font-heading">Project Management</h1>
                        <a href="project-form.php" class="btn btn-primary"><i class="bi bi-plus-lg me-2"></i>Add Project</a>
                    </div>
                    <div class="card border-0 shadow-sm p-4 rounded-4">
                        <div class="table-responsive">
                            <table class="table align-middle">
                                <thead class="table-light">
                                    <tr><th>Order</th><th>Title</th><th>Tech</th><th>Status</th><th class="text-end">Actions</th></tr>
                                </thead>
                                <tbody>
                                    <?php while($p = mysqli_fetch_assoc($projects_result)): ?>
                                    <tr>
                                        <td>
                                            <div class="btn-group btn-group-sm">
                                                <a href="index.php?tab=projects&move=up&pid=<?php echo $p['id']; ?>" class="btn btn-outline-secondary"><i class="bi bi-arrow-up"></i></a>
                                                <a href="index.php?tab=projects&move=down&pid=<?php echo $p['id']; ?>" class="btn btn-outline-secondary"><i class="bi bi-arrow-down"></i></a>
                                            </div>
                                        </td>
                                        <td><strong><?php echo sanitize_input($p['title']); ?></strong></td>
                                        <td><?php echo sanitize_input($p['technologies']); ?></td>
                                        <td><span class="badge bg-<?php echo $p['status']==='Published'?'success':'secondary'; ?>"><?php echo $p['status']; ?></span></td>
                                        <td class="text-end">
                                            <a href="project-form.php?id=<?php echo $p['id']; ?>" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                                            <a href="index.php?delete_project=<?php echo $p['id']; ?>" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></a>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <?php endif; ?>
            </main>
        </div>
    </div>
</body>
</html>