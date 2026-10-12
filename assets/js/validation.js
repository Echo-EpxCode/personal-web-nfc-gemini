document.addEventListener("DOMContentLoaded", () => {
    const starInput = document.getElementById("starRatingInput");
    const ratingValueInput = document.getElementById("ratingValue");
    const ratingError = document.getElementById("ratingError");

    if (starInput) {
        const stars = starInput.querySelectorAll("i");
        stars.forEach((star) => {
            star.addEventListener("click", () => {
                const val = star.getAttribute("data-rating");
                ratingValueInput.value = val;
                ratingError.style.display = "none";
                stars.forEach((s) => {
                    const sVal = s.getAttribute("data-rating");
                    if (sVal <= val) {
                        s.classList.remove("bi-star");
                        s.classList.add("bi-star-fill", "text-warning");
                    } else {
                        s.classList.remove("bi-star-fill", "text-warning");
                        s.classList.add("bi-star");
                    }
                });
            });
        });
    }

    // Review starters
    const starters = document.querySelectorAll(".review-starter");
    const reviewTextarea = document.getElementById("reviewText");
    starters.forEach((btn) => {
        btn.addEventListener("click", () => {
            reviewTextarea.value = btn.getAttribute("data-text");
        });
    });

    // File selection previews
    const fileInput = document.getElementById("reviewPhotos");
    const previewContainer = document.getElementById("photoPreviewContainer");
    const photoError = document.getElementById("photoError");
    let selectedFiles = [];

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            photoError.textContent = "";
            const files = Array.from(e.target.files);

            if (files.length + selectedFiles.length > 3) {
                photoError.textContent = "Maximum 3 photos allowed.";
                fileInput.value = "";
                return;
            }

            files.forEach((file) => {
                if (file.size > 10 * 1024 * 1024) {
                    photoError.textContent = `File ${file.name} exceeds 10MB limit.`;
                    return;
                }
                if (!["image/jpeg", "image/jpg"].includes(file.type)) {
                    photoError.textContent = `File ${file.name} is not a valid JPEG/JPG image.`;
                    return;
                }
                selectedFiles.push(file);
            });

            renderPhotoPreviews();
        });
    }

    window.removeSelectedPhoto = function (index) {
        selectedFiles.splice(index, 1);
        renderPhotoPreviews();
    };

    function renderPhotoPreviews() {
        if (!previewContainer) return;
        previewContainer.innerHTML = selectedFiles
            .map(
                (file, idx) => `
            <div class="position-relative d-inline-block">
                <img src="${URL.createObjectURL(file)}" class="rounded-3 border object-fit-cover" style="width: 60px; height: 60px;">
                <button type="button" class="btn-close btn-close-white bg-dark rounded-circle position-absolute top-0 end-0 p-1 m-1" style="font-size: 8px;" onclick="removeSelectedPhoto(${idx})" aria-label="Remove photo"></button>
            </div>
        `,
            )
            .join("");
    }

    // Form submission validation
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById("customerName");
            if (!nameInput.value.trim()) {
                nameInput.classList.add("is-invalid");
                isValid = false;
            } else {
                nameInput.classList.remove("is-invalid");
            }

            if (!ratingValueInput.value) {
                ratingError.style.display = "block";
                isValid = false;
            }

            if (!reviewTextarea.value.trim()) {
                reviewTextarea.classList.add("is-invalid");
                isValid = false;
            } else {
                reviewTextarea.classList.remove("is-invalid");
            }

            if (!isValid) return;

            // Simulate submission success
            const submitBtn = document.getElementById("submitReviewBtn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Submitting...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Review";

                // Add to demoReviews as pending
                const newRev = {
                    id: "rev-" + (demoReviews.length + 1),
                    customerName: nameInput.value.trim(),
                    email: document.getElementById("customerEmail").value.trim(),
                    rating: parseInt(ratingValueInput.value),
                    reviewText: reviewTextarea.value.trim(),
                    status: "pending",
                    createdAt: new Date().toISOString().split("T")[0],
                    photos:
                        selectedFiles.length > 0
                            ? selectedFiles.map(() => "assets/images/placeholders/review1.jpg")
                            : [],
                };
                demoReviews.push(newRev);

                const modalEl = document.getElementById("reviewModal");
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                reviewForm.reset();
                selectedFiles = [];
                previewContainer.innerHTML = "";
                ratingValueInput.value = "";
                stars.forEach((s) => {
                    s.classList.remove("bi-star-fill", "text-warning");
                    s.classList.add("bi-star");
                });

                Swal.fire({
                    icon: "success",
                    title: "Review Received!",
                    text: "Thank you! Your review has been submitted successfully and is awaiting moderation approval.",
                    confirmButtonColor: "#16A34A",
                });
            }, 1000);
        });
    }
});
