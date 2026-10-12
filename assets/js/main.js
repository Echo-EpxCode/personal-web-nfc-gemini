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

    // Close mobile navbar on link click
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (navbarCollapse.classList.contains("show")) {
                    bsCollapse.hide();
                }
            });
        });
    }
});
