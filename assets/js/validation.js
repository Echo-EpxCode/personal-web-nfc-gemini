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

    // Form submission validation and backend integration
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById("customerName");
            const ratingValueInput = document.getElementById("ratingValue");
            const reviewTextarea = document.getElementById("reviewText");
            const ratingError = document.getElementById("ratingError");

            if (!nameInput.value.trim()) {
                nameInput.classList.add("is-invalid");
                isValid = false;
            } else {
                nameInput.classList.remove("is-invalid");
            }

            if (!ratingValueInput.value) {
                ratingError.style.display = "block";
                isValid = false;
            } else {
                ratingError.style.display = "none";
            }

            if (!reviewTextarea.value.trim()) {
                reviewTextarea.classList.add("is-invalid");
                isValid = false;
            } else {
                reviewTextarea.classList.remove("is-invalid");
            }

            if (!isValid) return;

            const submitBtn = document.getElementById("submitReviewBtn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Submitting...`;

            try {
                const formData = new FormData();
                formData.append("customerName", nameInput.value.trim());
                formData.append("customerEmail", document.getElementById("customerEmail").value.trim());
                formData.append("rating", ratingValueInput.value);
                formData.append("reviewText", reviewTextarea.value.trim());

                // Append selected files safely using the selectedFiles array
                if (typeof selectedFiles !== "undefined" && selectedFiles.length > 0) {
                    selectedFiles.forEach((file) => {
                        formData.append("reviewPhotos[]", file);
                    });
                }

                const basePath = window.location.pathname.includes("/admin") ? "../" : "";
                const response = await fetch(`${basePath}actions/submit-review.php`, {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Review";

                if (result.success) {
                    const modalEl = document.getElementById("reviewModal");
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    modal.hide();
                    reviewForm.reset();
                    if (typeof selectedFiles !== "undefined") selectedFiles = [];
                    if (previewContainer) previewContainer.innerHTML = "";
                    ratingValueInput.value = "";

                    // Fix: Directly query and reset the star icons
                    document.querySelectorAll("#starRatingInput i").forEach((s) => {
                        s.classList.remove("bi-star-fill", "text-warning");
                        s.classList.add("bi-star");
                    });

                    Swal.fire({
                        icon: "success",
                        title: "Review Received!",
                        text: result.message,
                        confirmButtonColor: "#16A34A",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Submission Failed",
                        text: result.error || "Please check your inputs and try again.",
                        confirmButtonColor: "#DC2626",
                    });
                }
            } catch (error) {
                console.error("Error submitting review:", error);
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Review";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected server error occurred. Please try again.",
                    confirmButtonColor: "#DC2626",
                });
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleSuggestionsBtn");
    const hiddenContainer = document.getElementById("hiddenSuggestions");
    const reviewTextarea = document.getElementById("reviewText"); // matches your review text input ID

    // Toggle "+3 More" / "Show Less" view
    if (toggleBtn && hiddenContainer) {
        toggleBtn.addEventListener("click", function () {
            hiddenContainer.classList.toggle("d-none");
            if (hiddenContainer.classList.contains("d-none")) {
                toggleBtn.textContent = "+3 More";
            } else {
                toggleBtn.textContent = "Show Less";
            }
        });
    }

    // Click chip to append text to the review textarea - ON COMMENT SA INDEX.PHP
    document.querySelectorAll(".suggestion-chip").forEach((chip) => {
        chip.addEventListener("click", function () {
            const textToAdd = this.getAttribute("data-text");
            if (reviewTextarea) {
                const currentVal = reviewTextarea.value.trim();
                reviewTextarea.value = currentVal ? currentVal + " " + textToAdd : textToAdd;
                reviewTextarea.focus();
            }

            // Optional visual active toggle
            this.classList.toggle("btn-outline-secondary");
            this.classList.toggle("btn-dark");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleStartersBtn");
    const hiddenContainer = document.getElementById("hiddenStarters");

    if (toggleBtn && hiddenContainer) {
        toggleBtn.addEventListener("click", function () {
            hiddenContainer.classList.toggle("d-none");
            if (hiddenContainer.classList.contains("d-none")) {
                toggleBtn.textContent = "+3 More";
            } else {
                toggleBtn.textContent = "Show Less";
            }
        });
    }
});
