let reviewsDisplayCount = 6;
let currentReviewPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    loadReviewsData();

    const loadMoreBtn = document.getElementById("loadMoreReviewsBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            currentReviewPage++;
            loadReviewsData(true);
        });
    }
});

async function loadReviewsData(append = false) {
    try {
        const response = await fetch(`actions/get-reviews.php?page=${currentReviewPage}`);

        const responseText = await response.text();

        console.log("HTTP status:", response.status);
        console.log("Response body:", responseText);

        if (!responseText.trim()) {
            throw new Error("The PHP endpoint returned an empty response.");
        }

        let data;

        try {
            data = JSON.parse(responseText);
        } catch (error) {
            throw new Error(`The PHP endpoint returned invalid JSON. HTTP ${response.status}.`);
        }

        if (data.success) {
            renderRatingSummary(data.averageRating, data.total);
            renderReviews(data.reviews, append, data.total);
        }
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}

function renderRatingSummary(avg, total) {
    const summaryEl = document.getElementById("ratingSummary");
    if (!summaryEl) return;

    if (total === 0) {
        summaryEl.innerHTML = `<p class="text-muted mb-0">No approved reviews yet.</p>`;
        return;
    }

    let starsHtml = "";
    const fullStars = Math.floor(avg);
    for (let i = 0; i < 5; i++) {
        starsHtml +=
            i < fullStars ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-star text-muted"></i>';
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

function renderReviews(reviews, append, totalApproved) {
    const container = document.getElementById("reviewsContainer");
    const loadMoreBtn = document.getElementById("loadMoreReviewsBtn");
    if (!container) return;

    if (reviews.length === 0 && !append) {
        container.innerHTML = `<p class="text-center text-muted py-5 mb-0">No reviews available at the moment.</p>`;
        document.dispatchEvent(new Event("review-cards-updated"));
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
    }

    const existingCount = append
        ? container.querySelectorAll(".review-card-slide:not(.review-loop-clone) .review-card").length
        : 0;

    const cardsHtml = reviews
        .map((review, index) => {
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars +=
                    i <= review.rating
                        ? '<i class="bi bi-star-fill text-warning"></i>'
                        : '<i class="bi bi-star text-muted"></i>';
            }

            const photos = Array.isArray(review.photos) ? review.photos.slice(0, 3) : [];
            const photosHtml = photos.length
                ? `
                    <div class="review-photo-grid review-photo-grid-${photos.length}">
                        ${photos
                            .map(
                                (photo) => `
                                <button type="button" class="review-photo-tile" onclick="openLightbox('${photo}')" aria-label="View customer photo">
                                    <img src="${photo}" alt="Customer photo" class="review-thumb" loading="lazy">
                                </button>
                            `,
                            )
                            .join("")}
                    </div>
                `
                : "";

            return `
            <div class="review-card-slide" role="listitem" aria-label="Review ${existingCount + index + 1}">
                <article class="card border-0 shadow-sm p-4 h-100 rounded-4 review-card review-carousel-card d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle me-3"><i class="bi bi-person-fill fs-5"></i></div>
                            <div>
                                <h6 class="fw-bold font-heading mb-0">${review.customerName}</h6>
                                <small class="text-muted">${review.createdAt.split(" ")[0]}</small>
                            </div>
                        </div>
                        <div class="mb-2">${stars}</div>
                        <p class="review-text text-muted mb-3">"${review.reviewText}"</p>
                    </div>
                    <div class="review-card-photo-slot">${photosHtml}</div>
                </article>
            </div>
        `;
        })
        .join("");

    if (append) {
        container.insertAdjacentHTML("beforeend", cardsHtml);
    } else {
        container.innerHTML = cardsHtml;
    }

    document.dispatchEvent(new Event("review-cards-updated"));

    const renderedCount = container.querySelectorAll(".review-card-slide:not(.review-loop-clone) .review-card").length;

    if (loadMoreBtn) {
        if (renderedCount >= totalApproved) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "inline-block";
        }
    }
}
