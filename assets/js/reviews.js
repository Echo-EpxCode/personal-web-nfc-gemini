let reviewsDisplayCount = 6;

document.addEventListener("DOMContentLoaded", () => {
    renderRatingSummary();
    renderReviews();

    const loadMoreBtn = document.getElementById("loadMoreReviewsBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            reviewsDisplayCount += 6;
            renderReviews();
        });
    }
});

function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

function renderRatingSummary() {
    const summaryEl = document.getElementById("ratingSummary");
    if (!summaryEl) return;

    const approvedReviews = demoReviews.filter((r) => r.status === "approved");
    if (approvedReviews.length === 0) {
        summaryEl.innerHTML = `<p class="text-muted mb-0">No approved reviews yet.</p>`;
        return;
    }

    const total = approvedReviews.length;
    const avg = (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);

    let starsHtml = "";
    const fullStars = Math.floor(avg);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
        } else {
            starsHtml += '<i class="bi bi-star text-muted"></i>';
        }
    }

    summaryEl.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
                <h3 class="display-5 fw-bold font-heading mb-0 text-primary">${avg}</h3>
                <div class="fs-5 my-1">${starsHtml}</div>
                <p class="text-muted small mb-0">Based on ${total} verified customer reviews</p>
            </div>
            <div class="col-md-8 border-start-md ps-md-4">
                <p class="text-muted mb-0">"Our NFC review cards empower clients to leave genuine feedback instantly with a single tap, elevating our online reputation organically."</p>
            </div>
        </div>
    `;
}

function renderReviews() {
    const container = document.getElementById("reviewsContainer");
    const loadMoreBtn = document.getElementById("loadMoreReviewsBtn");
    if (!container) return;

    const approvedReviews = demoReviews
        .filter((r) => r.status === "approved")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const visibleReviews = approvedReviews.slice(0, reviewsDisplayCount);

    if (visibleReviews.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No reviews available at the moment.</p></div>`;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
    }

    container.innerHTML = visibleReviews
        .map((review) => {
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars +=
                    i <= review.rating
                        ? '<i class="bi bi-star-fill text-warning"></i>'
                        : '<i class="bi bi-star text-muted"></i>';
            }

            let photosHtml = "";
            if (review.photos && review.photos.length > 0) {
                photosHtml =
                    `<div class="d-flex gap-2 mt-3">` +
                    review.photos
                        .map(
                            (p) => `
                <img src="${p}" alt="Customer photo" class="review-thumb" onclick="openLightbox('${p}')">
            `,
                        )
                        .join("") +
                    `</div>`;
            }

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm p-4 h-100 rounded-4 review-card d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle me-3">${getInitials(review.customerName)}</div>
                            <div>
                                <h6 class="fw-bold font-heading mb-0">${review.customerName}</h6>
                                <small class="text-muted">${review.createdAt}</small>
                            </div>
                        </div>
                        <div class="mb-2">${stars}</div>
                        <p class="text-muted mb-3">"${review.reviewText}"</p>
                    </div>
                    <div>${photosHtml}</div>
                </div>
            </div>
        `;
        })
        .join("");

    if (loadMoreBtn) {
        if (reviewsDisplayCount >= approvedReviews.length) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "inline-block";
        }
    }
}
