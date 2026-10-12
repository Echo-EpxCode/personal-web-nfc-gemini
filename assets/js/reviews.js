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
        const data = await response.json();

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
        container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No reviews available at the moment.</p></div>`;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
    }

    const cardsHtml = reviews
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
                const count = review.photos.length;
                let layoutStyle = "";
                let itemsHtml = "";

                if (count === 1) {
                    layoutStyle = "grid-template-columns: 1fr; height: 170px;";
                    itemsHtml = `
                        <div style="overflow: hidden; border-radius: 8px; height: 100%;">
                            <img src="${review.photos[0]}" alt="Customer photo" class="review-thumb" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s ease;" onclick="openLightbox('${review.photos[0]}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `;
                } else if (count === 2) {
                    layoutStyle = "grid-template-columns: 1fr 1fr; height: 130px;";
                    itemsHtml = review.photos
                        .map(
                            (p) => `
                        <div style="overflow: hidden; border-radius: 8px; height: 100%;">
                            <img src="${p}" alt="Customer photo" class="review-thumb" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s ease;" onclick="openLightbox('${p}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `,
                        )
                        .join("");
                } else {
                    // 3 photos: Asymmetric magazine collage (1 large left, 2 stacked right)
                    layoutStyle = "grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; height: 150px;";
                    itemsHtml = `
                        <div style="grid-row: span 2; overflow: hidden; border-radius: 8px; height: 100%;">
                            <img src="${review.photos[0]}" alt="Customer photo" class="review-thumb" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s ease;" onclick="openLightbox('${review.photos[0]}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                        <div style="overflow: hidden; border-radius: 8px; height: 100%;">
                            <img src="${review.photos[1]}" alt="Customer photo" class="review-thumb" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s ease;" onclick="openLightbox('${review.photos[1]}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                        <div style="overflow: hidden; border-radius: 8px; height: 100%;">
                            <img src="${review.photos[2]}" alt="Customer photo" class="review-thumb" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s ease;" onclick="openLightbox('${review.photos[2]}')" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `;
                }

                photosHtml = `
                    <div style="display: grid; ${layoutStyle} gap: 6px; margin-top: 1rem;">
                        ${itemsHtml}
                    </div>
                `;
            }

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm p-4 h-100 rounded-4 review-card d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar-circle me-3"><i class="bi bi-person-fill fs-5"></i></div>
                            <div>
                                <h6 class="fw-bold font-heading mb-0">${review.customerName}</h6>
                                <small class="text-muted">${review.createdAt.split(" ")[0]}</small>
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

    if (append) {
        container.insertAdjacentHTML("beforeend", cardsHtml);
    } else {
        container.innerHTML = cardsHtml;
    }

    if (loadMoreBtn) {
        const renderedCount = container.querySelectorAll(".review-card").length;
        if (renderedCount >= totalApproved) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "inline-block";
        }
    }
}
