let projectsDisplayCount = 6;

document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
    renderCustomerPhotos();

    const loadMoreBtn = document.getElementById("loadMoreProjectsBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            projectsDisplayCount += 6;
            renderProjects();
        });
    }
});

function renderProjects() {
    const container = document.getElementById("projectsContainer");
    const loadMoreBtn = document.getElementById("loadMoreProjectsBtn");
    if (!container) return;

    const publishedProjects = demoProjects
        .filter((p) => p.status === "Published")
        .sort((a, b) => a.displayOrder - b.displayOrder);

    const visibleProjects = publishedProjects.slice(0, projectsDisplayCount);

    if (visibleProjects.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No published projects found.</p></div>`;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
    }

    container.innerHTML = visibleProjects
        .map((proj) => {
            return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden cursor-pointer" onclick="openProjectModal('${proj.id}')">
                    <img src="${proj.coverImage}" alt="${proj.title}" class="card-img-top object-fit-cover" style="height: 220px;" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60';">
                    <div class="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                            <span class="badge bg-primary-subtle text-primary mb-2">${proj.techStack.split(",")[0]}</span>
                            <h5 class="fw-bold font-heading mb-2">${proj.title}</h5>
                            <p class="text-muted small mb-3">${proj.description}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                            <small class="text-muted">${proj.completionDate || ""}</small>
                            <span class="text-primary fw-semibold small">View Details <i class="bi bi-arrow-right ms-1"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        })
        .join("");

    if (loadMoreBtn) {
        if (projectsDisplayCount >= publishedProjects.length) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "inline-block";
        }
    }
}

function openProjectModal(projectId) {
    const proj = demoProjects.find((p) => p.id === projectId);
    if (!proj) return;

    document.getElementById("projectModalTitle").textContent = proj.title;

    let sourceBtnHtml = proj.sourceUrl
        ? `
        <a href="${proj.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-sm">
            <i class="bi bi-github me-2"></i>Source Code
        </a>
    `
        : "";

    document.getElementById("projectModalBody").innerHTML = `
        <img src="${proj.coverImage}" alt="${proj.title}" class="img-fluid rounded-4 mb-3 w-100 object-fit-cover" style="max-height: 350px;" onclick="openLightbox('${proj.coverImage}')">
        <p class="text-muted mb-3">${proj.description}</p>
        <div class="mb-3">
            <strong>Technology Stack:</strong> <span class="text-muted">${proj.techStack}</span>
        </div>
        ${proj.completionDate ? `<div class="mb-3"><strong>Completion Date:</strong> <span class="text-muted">${proj.completionDate}</span></div>` : ""}
        <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            ${sourceBtnHtml}
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("projectModal"));
    modal.show();
}

function renderCustomerPhotos() {
    const container = document.getElementById("customerPhotosContainer");
    if (!container) return;

    const approvedReviewsWithPhotos = demoReviews.filter(
        (r) => r.status === "approved" && r.photos && r.photos.length > 0,
    );

    if (approvedReviewsWithPhotos.length === 0) {
        container.innerHTML = `<div class="col-12 text-center"><p class="text-muted small">No customer photos submitted yet.</p></div>`;
        return;
    }

    let photoEntries = [];
    approvedReviewsWithPhotos.forEach((rev) => {
        rev.photos.forEach((photo) => {
            photoEntries.push({
                photo: photo,
                customerName: rev.customerName,
                rating: rev.rating,
                reviewText: rev.reviewText,
                date: rev.createdAt,
            });
        });
    });

    container.innerHTML = photoEntries
        .map(
            (item) => `
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <img src="${item.photo}" alt="Customer photo by ${item.customerName}" class="card-img-top object-fit-cover cursor-pointer" style="height: 240px;" onclick="openLightbox('${item.photo}')">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="fw-bold font-heading mb-0">${item.customerName}</h6>
                        <span class="text-warning small"><i class="bi bi-star-fill"></i> ${item.rating}</span>
                    </div>
                    <p class="text-muted small mb-0 text-truncate">"${item.reviewText}"</p>
                </div>
            </div>
        </div>
    `,
        )
        .join("");
}
