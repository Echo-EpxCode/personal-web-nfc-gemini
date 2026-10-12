document.addEventListener("DOMContentLoaded", () => {
    // Dynamically set footer copyright year
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Render Social Links in Footer (Configured placeholders)
    const socialLinks = [
        { name: "Facebook", icon: "bi-facebook", url: "https://facebook.com" },
        { name: "Instagram", icon: "bi-instagram", url: "https://instagram.com" },
        { name: "TikTok", icon: "bi-tiktok", url: "https://tiktok.com" },
        { name: "GitHub", icon: "bi-github", url: "https://github.com" },
        { name: "Portfolio", icon: "bi-globe", url: "#" },
    ];

    const socialContainer = document.getElementById("socialLinksContainer");
    if (socialContainer) {
        socialContainer.innerHTML = socialLinks
            .map(
                (link) => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-muted fs-5 social-icon-link" aria-label="${link.name}">
                <i class="bi ${link.icon}"></i>
            </a>
        `,
            )
            .join("");
    }

    const navbarDrawer = document.getElementById("navbarNav");
    const navbarToggler = document.querySelector('[data-bs-target="#navbarNav"]');
    const reviewNavButton = document.getElementById("reviewNavButton");

    if (navbarDrawer && navbarToggler) {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(navbarDrawer);

        navbarDrawer.addEventListener("show.bs.offcanvas", () => {
            navbarToggler.setAttribute("aria-expanded", "true");
        });
        navbarDrawer.addEventListener("hidden.bs.offcanvas", () => {
            navbarToggler.setAttribute("aria-expanded", "false");
        });

        navbarDrawer.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
            link.addEventListener("click", () => {
                if (navbarDrawer.classList.contains("show")) {
                    offcanvas.hide();
                }
            });
        });

        if (reviewNavButton) {
            reviewNavButton.addEventListener("click", () => {
                const reviewModal = document.getElementById("reviewModal");
                if (!reviewModal) return;

                const showReviewModal = () => bootstrap.Modal.getOrCreateInstance(reviewModal).show();
                if (navbarDrawer.classList.contains("show")) {
                    navbarDrawer.addEventListener("hidden.bs.offcanvas", showReviewModal, { once: true });
                    offcanvas.hide();
                } else {
                    showReviewModal();
                }
            });
        }
    }
});
