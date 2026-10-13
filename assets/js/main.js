function initializeReviewInfiniteScroll() {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll(".review-carousel").forEach((carousel) => {
        const track = carousel.querySelector(".review-card-track");
        if (!track) return;

        let cycleWidth = 0;
        let animationFrameId = null;
        let previousFrameTime = 0;
        let resumeTimeoutId = null;
        let pointerHovered = false;
        let focusWithin = false;
        let touching = false;

        const rebuildLoop = () => {
            const scrollProgress = cycleWidth > 1 ? (track.scrollLeft % cycleWidth) / cycleWidth : 0;
            track.querySelectorAll(".review-loop-clone").forEach((clone) => clone.remove());
            track.classList.remove("review-infinite-track");
            cycleWidth = 0;

            const cards = Array.from(track.children).filter((card) => card.classList.contains("review-card-slide"));
            if (cards.length < 2) {
                updatePlayback();
                return;
            }

            const cardGap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
            const measuredCycleWidth =
                cards[cards.length - 1].getBoundingClientRect().right - cards[0].getBoundingClientRect().left + cardGap;
            if (measuredCycleWidth <= 1) {
                updatePlayback();
                return;
            }

            cycleWidth = measuredCycleWidth;

            if (reducedMotionQuery.matches) {
                const maxNativeScroll = Math.max(0, track.scrollWidth - track.clientWidth);
                track.scrollLeft = Math.min(maxNativeScroll, cycleWidth * scrollProgress);
                updatePlayback();
                return;
            }

            track.classList.add("review-infinite-track");

            const cloneSetCount = Math.ceil(track.clientWidth / cycleWidth) + 1;
            for (let setIndex = 0; setIndex < cloneSetCount; setIndex++) {
                cards.forEach((card) => {
                    const clone = card.cloneNode(true);
                    clone.classList.add("review-loop-clone");
                    clone.setAttribute("aria-hidden", "true");
                    clone.inert = true;
                    track.append(clone);
                });
            }

            track.scrollLeft = cycleWidth * scrollProgress;
            updatePlayback();
        };

        const animate = (frameTime) => {
            if (previousFrameTime > 0) {
                const elapsed = Math.min(frameTime - previousFrameTime, 50);
                track.scrollLeft += elapsed * 0.032;
                if (track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
            }

            previousFrameTime = frameTime;
            animationFrameId = window.requestAnimationFrame(animate);
        };

        const updatePlayback = () => {
            const shouldPlay =
                !reducedMotionQuery.matches &&
                cycleWidth > 1 &&
                !pointerHovered &&
                !focusWithin &&
                !touching &&
                !document.hidden;

            if (shouldPlay && animationFrameId === null) {
                previousFrameTime = 0;
                animationFrameId = window.requestAnimationFrame(animate);
            } else if (!shouldPlay && animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                previousFrameTime = 0;
            }
        };

        const normalizeManualScroll = () => {
            if (cycleWidth > 1 && track.scrollLeft >= cycleWidth) {
                track.scrollLeft %= cycleWidth;
            }
        };

        const pauseForTouch = () => {
            touching = true;
            window.clearTimeout(resumeTimeoutId);
            updatePlayback();
        };

        const resumeAfterTouch = () => {
            window.clearTimeout(resumeTimeoutId);
            resumeTimeoutId = window.setTimeout(() => {
                touching = false;
                updatePlayback();
            }, 5000);
        };

        carousel.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "mouse") {
                pointerHovered = true;
                updatePlayback();
            }
        });
        carousel.addEventListener("pointerleave", (event) => {
            if (event.pointerType === "mouse") {
                pointerHovered = false;
                updatePlayback();
            }
        });
        carousel.addEventListener("focusin", () => {
            focusWithin = true;
            updatePlayback();
        });
        carousel.addEventListener("focusout", (event) => {
            if (!carousel.contains(event.relatedTarget)) {
                focusWithin = false;
                updatePlayback();
            }
        });
        carousel.addEventListener("touchstart", pauseForTouch, { passive: true });
        carousel.addEventListener("touchend", resumeAfterTouch, { passive: true });
        carousel.addEventListener("touchcancel", resumeAfterTouch, { passive: true });
        carousel.addEventListener(
            "wheel",
            () => {
                pauseForTouch();
                resumeAfterTouch();
            },
            { passive: true },
        );
        track.addEventListener("scroll", normalizeManualScroll, { passive: true });
        document.addEventListener("visibilitychange", updatePlayback);
        document.addEventListener("review-cards-updated", rebuildLoop);
        window.addEventListener("resize", rebuildLoop);
        reducedMotionQuery.addEventListener("change", rebuildLoop);

        rebuildLoop();
    });
}

function initializeHorizontalAutoScroll() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".project-carousel").forEach((carousel) => {
        const track = carousel.querySelector(".project-card-track");
        if (!track) return;

        let intervalId = null;
        let resumeTimeoutId = null;
        let focusWithin = false;
        let touching = false;

        const advanceTrack = () => {
            const firstCard = track.querySelector(".review-card-slide, .project-card-slide");
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            if (!firstCard || maxScroll <= 1) return;

            const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
            const step = firstCard.getBoundingClientRect().width + gap;
            if (track.scrollLeft >= maxScroll - 1) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollTo({ left: Math.min(track.scrollLeft + step, maxScroll), behavior: "smooth" });
            }
        };

        const updatePlayback = () => {
            const shouldPlay = !prefersReducedMotion && !focusWithin && !touching && !document.hidden;
            if (shouldPlay && intervalId === null) {
                intervalId = window.setInterval(advanceTrack, 5000);
            } else if (!shouldPlay && intervalId !== null) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        };

        const pauseForTouch = () => {
            touching = true;
            window.clearTimeout(resumeTimeoutId);
            updatePlayback();
        };

        const resumeAfterTouch = () => {
            window.clearTimeout(resumeTimeoutId);
            resumeTimeoutId = window.setTimeout(() => {
                touching = false;
                updatePlayback();
            }, 5000);
        };

        carousel.addEventListener("focusin", () => {
            focusWithin = true;
            updatePlayback();
        });
        carousel.addEventListener("focusout", (event) => {
            if (!carousel.contains(event.relatedTarget)) {
                focusWithin = false;
                updatePlayback();
            }
        });
        carousel.addEventListener("touchstart", pauseForTouch, { passive: true });
        carousel.addEventListener("touchend", resumeAfterTouch, { passive: true });
        carousel.addEventListener("touchcancel", resumeAfterTouch, { passive: true });
        carousel.addEventListener(
            "wheel",
            () => {
                pauseForTouch();
                resumeAfterTouch();
            },
            { passive: true },
        );
        document.addEventListener("visibilitychange", updatePlayback);

        updatePlayback();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeReviewInfiniteScroll();
    initializeHorizontalAutoScroll();
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
