let currentProjectPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    loadProjectsData();

    const projectTrack = document.getElementById("projectsContainer");
    const previousProjectBtn = document.getElementById("previousProjectBtn");
    const nextProjectBtn = document.getElementById("nextProjectBtn");

    if (projectTrack && previousProjectBtn && nextProjectBtn) {
        const scrollByProjectCard = (direction) => {
            const firstCard = projectTrack.querySelector(".project-card-slide");
            if (!firstCard) return;

            const gap = Number.parseFloat(window.getComputedStyle(projectTrack).columnGap) || 0;
            projectTrack.scrollBy({
                left: direction * (firstCard.getBoundingClientRect().width + gap),
                behavior: "auto",
            });
        };

        previousProjectBtn.addEventListener("click", () => scrollByProjectCard(-1));
        nextProjectBtn.addEventListener("click", () => scrollByProjectCard(1));
        projectTrack.addEventListener("scroll", updateProjectScrollControls, { passive: true });
        window.addEventListener("resize", updateProjectScrollControls);
    }

    const loadMoreBtn = document.getElementById("loadMoreProjectsBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            currentProjectPage++;
            loadProjectsData(true);
        });
    }
});

function updateProjectScrollControls() {
    const projectTrack = document.getElementById("projectsContainer");
    const controls = document.getElementById("projectCarouselControls");
    const previousProjectBtn = document.getElementById("previousProjectBtn");
    const nextProjectBtn = document.getElementById("nextProjectBtn");
    if (!projectTrack) return;

    const projectCount = projectTrack.querySelectorAll(".project-card-slide").length;
    const maxScroll = Math.max(0, projectTrack.scrollWidth - projectTrack.clientWidth);
    const hasScrollableProjects = projectCount > 1 && maxScroll > 1;
    if (controls) {
        controls.hidden = !hasScrollableProjects;
        controls.classList.toggle("d-flex", hasScrollableProjects);
    }

    if (previousProjectBtn) previousProjectBtn.disabled = projectTrack.scrollLeft <= 1;
    if (nextProjectBtn) nextProjectBtn.disabled = maxScroll <= 1 || projectTrack.scrollLeft >= maxScroll - 1;
}

async function loadProjectsData(append = false) {
    try {
        // Determine correct base path dynamically
        const basePath = window.location.pathname.includes("/admin") ? "../" : "";
        const response = await fetch(`${basePath}actions/get-projects.php?page=${currentProjectPage}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            renderProjects(data.projects, append);
        } else {
            console.error("Server returned unsuccessful response:", data);
        }
    } catch (error) {
        console.error("Error loading projects:", error);
        const container = document.getElementById("projectsContainer");
        if (container && !append) {
            container.innerHTML = `<p class="w-100 text-center text-danger py-5 mb-0">Unable to load projects at this time. Please check your connection.</p>`;
            updateProjectScrollControls();
        }
    }
}

function renderProjects(projects, append) {
    const container = document.getElementById("projectsContainer");
    const loadMoreBtn = document.getElementById("loadMoreProjectsBtn");
    if (!container) return;

    if (projects.length === 0 && !append) {
        container.innerHTML = `<p class="w-100 text-center text-muted py-5 mb-0">No published projects found.</p>`;
        updateProjectScrollControls();
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
    }

    const cardsHtml = projects
        .map((proj) => {
            return `
            <div class="project-card-slide" role="listitem" aria-label="${proj.title}">
                <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden cursor-pointer project-carousel-card" onclick="openProjectModal(${proj.id})">
                    <img src="${proj.cover_image}" alt="${proj.title}" class="card-img-top object-fit-cover project-card-image" loading="lazy">
                    <div class="card-body project-card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                            <span class="badge bg-primary-subtle text-primary mb-2">${proj.technologies.split(",")[0]}</span>
                            <h5 class="project-card-title fw-bold font-heading mb-2">${proj.title}</h5>
                            <p class="project-card-description text-muted small mb-3">${proj.description}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                            <small class="text-muted">${proj.completion_date || ""}</small>
                            <span class="text-primary fw-semibold small">View Details <i class="bi bi-arrow-right ms-1"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        })
        .join("");

    if (append) {
        container.insertAdjacentHTML("beforeend", cardsHtml);
    } else {
        container.innerHTML = cardsHtml;
    }

    updateProjectScrollControls();

    if (projects.length < 6 && loadMoreBtn) {
        loadMoreBtn.style.display = "none";
    }
}

async function openProjectModal(projectId) {
    try {
        const response = await fetch(`actions/get-projects.php`);
        const data = await response.json();
        const proj = data.projects.find((p) => p.id == projectId);
        if (!proj) return;

        document.getElementById("projectModalTitle").textContent = proj.title;

        let sourceBtnHtml = proj.source_url
            ? `
            <a href="${proj.source_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-github me-2"></i>Source Code
            </a>
        `
            : "";

        document.getElementById("projectModalBody").innerHTML = `
            <img src="${proj.cover_image}" alt="${proj.title}" class="img-fluid rounded-4 mb-3 w-100 object-fit-cover" style="max-height: 350px;" onclick="openLightbox('${proj.cover_image}')">
            <p class="text-muted mb-3">${proj.description}</p>
            <div class="mb-3">
                <strong>Technology Stack:</strong> <span class="text-muted">${proj.technologies}</span>
            </div>
            ${proj.completion_date ? `<div class="mb-3"><strong>Completion Date:</strong> <span class="text-muted">${proj.completion_date}</span></div>` : ""}
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                ${sourceBtnHtml}
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById("projectModal"));
        modal.show();
    } catch (e) {
        console.error("Error opening project details:", e);
    }
}
