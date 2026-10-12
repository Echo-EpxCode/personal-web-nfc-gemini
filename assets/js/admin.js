document.addEventListener("DOMContentLoaded", () => {
    // Navigation between admin tabs
    const navLinks = document.querySelectorAll("#sidebar .nav-link[data-tab]");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");

            const tabId = link.getAttribute("data-tab");
            document.querySelectorAll(".admin-tab-content").forEach((tab) => tab.classList.add("d-none"));
            document.getElementById(`tab-${tabId}`).classList.remove("d-none");
        });
    });

    renderAdminOverview();
    renderAdminReviews();
    renderAdminProjects();

    // Event listeners for review filters
    const searchInput = document.getElementById("adminReviewSearch");
    const statusFilter = document.getElementById("adminReviewStatusFilter");
    const ratingFilter = document.getElementById("adminReviewRatingFilter");

    if (searchInput) searchInput.addEventListener("input", renderAdminReviews);
    if (statusFilter) statusFilter.addEventListener("change", renderAdminReviews);
    if (ratingFilter) ratingFilter.addEventListener("change", renderAdminReviews);

    // Project modal trigger
    const addProjBtn = document.getElementById("openAddProjectModalBtn");
    if (addProjBtn) {
        addProjBtn.addEventListener("click", () => {
            document.getElementById("adminProjectId").value = "";
            document.getElementById("adminProjectForm").reset();
            document.getElementById("adminProjectModalTitle").textContent = "Add New Project";
            const modal = new bootstrap.Modal(document.getElementById("adminProjectModal"));
            modal.show();
        });
    }

    // Project form submission
    const projectForm = document.getElementById("adminProjectForm");
    if (projectForm) {
        projectForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("adminProjectId").value;
            const title = document.getElementById("adminProjectTitle").value;
            const desc = document.getElementById("adminProjectDesc").value;
            const cover = document.getElementById("adminProjectCover").value;
            const tech = document.getElementById("adminProjectTech").value;
            const date = document.getElementById("adminProjectDate").value;
            const status = document.getElementById("adminProjectStatus").value;
            const url = document.getElementById("adminProjectUrl").value;

            if (id) {
                // Edit existing
                const proj = demoProjects.find((p) => p.id === id);
                if (proj) {
                    proj.title = title;
                    proj.description = desc;
                    proj.coverImage = cover;
                    proj.techStack = tech;
                    proj.completionDate = date;
                    proj.status = status;
                    proj.sourceUrl = url;
                }
            } else {
                // Create new
                const newProj = {
                    id: "proj-" + (demoProjects.length + 1),
                    title,
                    description: desc,
                    coverImage: cover,
                    techStack: tech || "PHP, Bootstrap",
                    completionDate: date || "October 2026",
                    sourceUrl: url,
                    status,
                    displayOrder: demoProjects.length + 1,
                };
                demoProjects.push(newProj);
            }

            const modalEl = document.getElementById("adminProjectModal");
            bootstrap.Modal.getInstance(modalEl).hide();
            renderAdminProjects();
            renderAdminOverview();

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Project saved successfully in local state.",
                confirmButtonColor: "#16A34A",
                timer: 1500,
            });
        });
    }
});

function renderAdminOverview() {
    const container = document.getElementById("overviewStatsContainer");
    const badge = document.getElementById("pendingBadge");
    if (!container) return;

    const total = demoReviews.length;
    const pending = demoReviews.filter((r) => r.status === "pending").length;
    const approved = demoReviews.filter((r) => r.status === "approved").length;
    const rejected = demoReviews.filter((r) => r.status === "rejected").length;

    if (badge) badge.textContent = pending;

    container.innerHTML = `
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-4 rounded-4 stat-card">
                <h6 class="text-muted mb-1">Total Reviews</h6>
                <h3 class="fw-bold font-heading mb-0">${total}</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-4 rounded-4 stat-card border-warning" style="border-left-color: var(--color-warning);">
                <h6 class="text-muted mb-1">Pending Reviews</h6>
                <h3 class="fw-bold font-heading mb-0 text-warning">${pending}</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-4 rounded-4 stat-card border-success" style="border-left-color: var(--color-success);">
                <h6 class="text-muted mb-1">Approved Reviews</h6>
                <h3 class="fw-bold font-heading mb-0 text-success">${approved}</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-4 rounded-4 stat-card border-danger" style="border-left-color: var(--color-danger);">
                <h6 class="text-muted mb-1">Rejected Reviews</h6>
                <h3 class="fw-bold font-heading mb-0 text-danger">${rejected}</h3>
            </div>
        </div>
    `;
}

function renderAdminReviews() {
    const tbody = document.getElementById("adminReviewsTableBody");
    if (!tbody) return;

    const searchQuery = document.getElementById("adminReviewSearch").value.toLowerCase();
    const statusVal = document.getElementById("adminReviewStatusFilter").value;
    const ratingVal = document.getElementById("adminReviewRatingFilter").value;

    const filtered = demoReviews.filter((r) => {
        const matchesSearch =
            r.customerName.toLowerCase().includes(searchQuery) || r.reviewText.toLowerCase().includes(searchQuery);
        const matchesStatus = statusVal === "all" || r.status === statusVal;
        const matchesRating = ratingVal === "all" || r.rating.toString() === ratingVal;
        return matchesSearch && matchesStatus && matchesRating;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No reviews match your filters.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered
        .map((r) => {
            let badgeClass = "bg-secondary";
            if (r.status === "approved") badgeClass = "bg-success";
            if (r.status === "pending") badgeClass = "bg-warning text-dark";
            if (r.status === "rejected") badgeClass = "bg-danger";

            return `
            <tr>
                <td><strong>${r.customerName}</strong><br><small class="text-muted">${r.email || "No email"}</small></td>
                <td><span class="text-warning"><i class="bi bi-star-fill"></i></span> ${r.rating}</td>
                <td><span class="d-inline-block text-truncate" style="max-width: 250px;">"${r.reviewText}"</span></td>
                <td>${r.createdAt}</td>
                <td><span class="badge ${badgeClass} text-uppercase">${r.status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewReviewDetail('${r.id}')" title="View details"><i class="bi bi-eye"></i></button>
                    ${r.status !== "approved" ? `<button class="btn btn-sm btn-outline-success me-1" onclick="updateReviewStatus('${r.id}', 'approved')" title="Approve"><i class="bi bi-check-lg"></i></button>` : ""}
                    ${r.status !== "rejected" ? `<button class="btn btn-sm btn-outline-warning me-1" onclick="updateReviewStatus('${r.id}', 'rejected')" title="Reject"><i class="bi bi-x-lg"></i></button>` : ""}
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteReview('${r.id}')" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
        })
        .join("");
}

window.updateReviewStatus = function (id, newStatus) {
    const r = demoReviews.find((item) => item.id === id);
    if (r) {
        r.status = newStatus;
        renderAdminReviews();
        renderAdminOverview();
        Swal.fire({
            icon: "success",
            title: `Review ${newStatus}`,
            text: `The review status has been updated to ${newStatus}.`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
        });
    }
};

window.deleteReview = function (id) {
    Swal.fire({
        title: "Delete Review?",
        text: "This action cannot be undone in this session.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        confirmButtonText: "Yes, delete",
    }).then((result) => {
        if (result.isConfirmed) {
            const index = demoReviews.findIndex((item) => item.id === id);
            if (index !== -1) {
                demoReviews.splice(index, 1);
                renderAdminReviews();
                renderAdminOverview();
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: "Review removed from local state.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        }
    });
};

window.viewReviewDetail = function (id) {
    const r = demoReviews.find((item) => item.id === id);
    if (!r) return;

    let photosHtml =
        r.photos && r.photos.length > 0
            ? `<div class="d-flex gap-2 mt-3">` +
              r.photos
                  .map(
                      (p) =>
                          `<img src="../${p}" class="rounded-3 border object-fit-cover" style="width: 80px; height: 80px;">`,
                  )
                  .join("") +
              `</div>`
            : '<p class="text-muted small mt-2">No photos attached.</p>';

    document.getElementById("adminReviewDetailBody").innerHTML = `
        <p><strong>Customer:</strong> ${r.customerName} (${r.email || "No email"})</p>
        <p><strong>Rating:</strong> ${r.rating} / 5</p>
        <p><strong>Date:</strong> ${r.createdAt}</p>
        <p><strong>Status:</strong> <span class="badge bg-secondary text-uppercase">${r.status}</span></p>
        <p><strong>Review Text:</strong><br>"${r.reviewText}"</p>
        <div><strong>Photos:</strong> ${photosHtml}</div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("adminReviewDetailModal"));
    modal.show();
};

function renderAdminProjects() {
    const tbody = document.getElementById("adminProjectsTableBody");
    if (!tbody) return;

    const sortedProjects = [...demoProjects].sort((a, b) => a.displayOrder - b.displayOrder);

    tbody.innerHTML = sortedProjects
        .map(
            (p, idx) => `
        <tr>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" onclick="moveProject('${p.id}', 'up')" ${idx === 0 ? "disabled" : ""}><i class="bi bi-arrow-up"></i></button>
                    <button class="btn btn-outline-secondary" onclick="moveProject('${p.id}', 'down')" ${idx === sortedProjects.length - 1 ? "disabled" : ""}><i class="bi bi-arrow-down"></i></button>
                </div>
            </td>
            <td><strong>${p.title}</strong><br><small class="text-muted">${p.completionDate || ""}</small></td>
            <td>${p.techStack}</td>
            <td><span class="badge ${p.status === "Published" ? "bg-success" : "bg-secondary"}">${p.status}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editProject('${p.id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProject('${p.id}')"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `,
        )
        .join("");
}

window.moveProject = function (id, direction) {
    const index = demoProjects.findIndex((p) => p.id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= demoProjects.length) return;

    // Swap display orders
    const tempOrder = demoProjects[index].displayOrder;
    demoProjects[index].displayOrder = demoProjects[targetIndex].displayOrder;
    demoProjects[targetIndex].displayOrder = tempOrder;

    demoProjects.sort((a, b) => a.displayOrder - b.displayOrder);
    renderAdminProjects();
};

window.editProject = function (id) {
    const p = demoProjects.find((item) => item.id === id);
    if (!p) return;

    document.getElementById("adminProjectId").value = p.id;
    document.getElementById("adminProjectTitle").value = p.title;
    document.getElementById("adminProjectDesc").value = p.description;
    document.getElementById("adminProjectCover").value = p.coverImage;
    document.getElementById("adminProjectTech").value = p.techStack;
    document.getElementById("adminProjectDate").value = p.completionDate;
    document.getElementById("adminProjectStatus").value = p.status;
    document.getElementById("adminProjectUrl").value = p.sourceUrl;
    document.getElementById("adminProjectModalTitle").textContent = "Edit Project";

    const modal = new bootstrap.Modal(document.getElementById("adminProjectModal"));
    modal.show();
};

window.deleteProject = function (id) {
    Swal.fire({
        title: "Delete Project?",
        text: "This will remove the project from the local list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        confirmButtonText: "Yes, delete",
    }).then((result) => {
        if (result.isConfirmed) {
            const index = demoProjects.findIndex((p) => p.id === id);
            if (index !== -1) {
                demoProjects.splice(index, 1);
                renderAdminProjects();
                renderAdminOverview();
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: "Project removed successfully.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        }
    });
};
