<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jonefer Codillo — Web Developer & Digital Solutions</title>
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap"
            rel="stylesheet">
        <!-- Bootstrap 5 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Bootstrap Icons -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
        <!-- SweetAlert2 CSS -->
        <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
        <!-- Custom CSS -->
        <link rel="stylesheet" href="assets/css/style.css">
        <link rel="stylesheet" href="assets/css/component.css">
    </head>

    <body>

        <!-- Sticky Header -->
        <header class="site-header sticky-top">
            <nav class="navbar navbar-expand-lg bg-surface border-bottom">
                <div class="container">
                    <a class="navbar-brand fw-bold font-heading text-dark" href="index.php">
                        <span class="text-primary">Jonefer</span> Codillo
                    </a>
                    <button class="navbar-toggler border-0 d-lg-none" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="offcanvas-lg offcanvas-end" tabindex="-1" id="navbarNav"
                        aria-labelledby="navbarNavLabel">
                        <div class="offcanvas-header">
                            <h2 class="offcanvas-title h5 font-heading mb-0" id="navbarNavLabel">Navigation</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                data-bs-target="#navbarNav" aria-label="Close navigation"></button>
                        </div>
                        <div class="offcanvas-body justify-content-end">
                            <ul class="navbar-nav align-items-lg-center gap-lg-3">
                                <li class="nav-item">
                                    <a class="nav-link" href="#hero">Introduction</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#reviews">Customer Reviews</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#portfolio">Explore My Work</a>
                                </li>
                                <li class="nav-item ms-lg-2">
                                    <button class="btn btn-primary btn-sm px-3" id="reviewNavButton" type="button">
                                        Write a Review
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <main>

            <!-- Section 1 — Developer Introduction -->
            <section id="hero" class="py-5 my-4">
                <div class="container">
                    <div class="row align-items-center g-5">
                        
                        <!-- Left Column: Introduction Text -->
                        <div class="col-lg-6 text-lg-start text-center">
                            <span class="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill fw-semibold mb-3">
                                <i class="bi bi-code-slash me-1"></i> Available for Freelance Projects
                            </span>
                            <h1 class="display-4 fw-bold font-heading mb-3">
                                Hi, I'm <span class="text-primary">Jonefer Codillo</span>
                            </h1>
                            <p class="lead text-muted mb-4">
                                Specializing in high-performance web applications, database architecture, and interactive NFC review systems that help businesses grow online.
                            </p>
                            <div class="d-flex flex-wrap gap-3 justify-content-lg-start justify-content-center">
                                <a href="#reviews" class="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                                    <i class="bi bi-chat-heart me-2"></i> View Reviews
                                </a>
                                <a href="https://m.me/epzcodillo8" target="_blank" class="btn btn-outline-dark px-4 py-2 rounded-pill">
                                    <img src="assets/img/messenger.png" alt="" aria-hidden="true" width="18" height="18"
                                        class="me-2 align-middle"> Get in Touch
                                </a>
                            </div>
                        </div>

                        <!-- Right Column: Modern Profile Picture with Overlaid Floating Card -->
                        <div class="col-lg-6 text-center">
                            <div class="position-relative d-inline-block p-2">
                                
                                <!-- Decorative Background Glow/Shape -->
                                <div class="position-absolute top-50 start-50 translate-middle bg-primary opacity-10 rounded-circle" style="width: 320px; height: 320px; filter: blur(40px); z-index: 0;"></div>

                            <!-- Profile Picture Container with Advanced Glassmorphism Overlay -->
                                <div class="position-relative d-inline-block">
                                    
                                    <!-- Ambient Backdrop Glow for Visual Depth -->
                                    <div class="position-absolute top-50 start-50 translate-middle bg-primary opacity-10 rounded-circle" style="width: 280px; height: 280px; filter: blur(50px); z-index: 0;"></div>
                                    <!-- Profile Picture Container with Advanced Glassmorphism Overlay -->
                                <div class="position-relative d-inline-block">
                                    
                                    <!-- Ambient Backdrop Glow for Visual Depth -->
                                    <div class="position-absolute top-50 start-50 translate-middle bg-primary opacity-10 rounded-circle" style="width: 280px; height: 280px; filter: blur(50px); z-index: 0;"></div>

                                    <!-- Profile Picture -->
                                    <img src="assets/img/profile.jpeg" alt="Jonefer Codillo - Freelance Web Developer" class="img-fluid rounded-4 shadow-lg position-relative" style="width: 340px; height: 410px; object-fit: cover; z-index: 1;">

                                    <!-- Overlaid Premium Glassmorphism Badge (Wider & Nudged Left) -->
                                    <div class="position-absolute bottom-0 mb-4 p-3 rounded-4 shadow-lg border border-white border-opacity-75 text-start expandable-card"
                                        style="z-index: 2; background: rgba(255, 255, 255, 0.90); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); width: 85%; max-width: 320px; left: 49%; transform: translateX(-50%);">
                                        
                                        <div class="d-flex align-items-center gap-3">
                                            <!-- Perfect Square Avatar/Icon with Live Pulse Status Dot -->
                                            <div class="position-relative">
                                                <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 46px; height: 46px; min-width: 46px;">
                                                    <i class="bi bi-code-slash text-primary fs-5"></i>
                                                </div>
                                                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle shadow-sm" style="width: 12px; height: 12px;" title="Available for projects">
                                                    <span class="visually-hidden">Available</span>
                                                </span>
                                            </div>

                                            <!-- Name & Title with Verified Indicator -->
                                            <div class="overflow-hidden">
                                                <div class="d-flex align-items-center gap-1">
                                                    <h6 class="fw-bold font-heading mb-0 text-dark text-truncate">Jonefer Codillo</h6>
                                                    <i class="bi bi-patch-check-fill text-primary" style="font-size: 0.8rem;" title="Verified Developer"></i>
                                                </div>
                                                <small class="text-muted fw-semibold d-block" style="font-size: 0.78rem;">Freelance Web Developer</small>
                                            </div>
                                        </div>

                                        <!-- Trust & Location Sub-Bar with Visible Solid Badge -->
                                        <div class="mt-2 pt-2 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                                            <span class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-geo-alt-fill text-danger me-2"></i>Matina Crossing, Davao City</span>
                                            <span class="badge bg-primary text-white fw-semibold px-1 py-1 shadow-sm" style="font-size: 0.65rem;">Ready to Code</span>
                                        </div>

                                    </div>
                                </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- Section 2 — Customer Reviews -->
            <section id="reviews" class="py-5 bg-surface border-top border-bottom">
                <div class="container py-lg-4">
                    <div class="row align-items-end mb-5">
                        <div class="col-lg-8">
                            <h2 class="fw-bold font-heading mb-2">What Customers Say</h2>
                            <p class="text-muted mb-0">Real feedback from customers using our NFC review cards.</p>
                        </div>
                        <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reviewModal">
                                <i class="bi bi-star-fill me-2"></i>Write a Review
                            </button>
                        </div>
                    </div>

                    <!-- Rating Summary Box -->
                    <div id="ratingSummary" class="card border-0 bg-light p-4 mb-5 rounded-4">
                        <!-- Dynamically populated by reviews.js -->
                    </div>

                    <!-- Horizontally Scrollable Customer Reviews -->
                    <div class="review-carousel mb-4" role="region" aria-label="Customer reviews">
                        <div id="reviewsContainer" class="review-card-track" role="list" tabindex="0"
                            aria-label="Scrollable customer review cards">
                            <!-- Dynamically populated by reviews.js -->
                        </div>
                    </div>

                    <!-- Load More Reviews Button -->
                    <div class="text-center mt-4">
                        <button id="loadMoreReviewsBtn" class="btn btn-outline-secondary px-4">Load More
                            Reviews</button>
                    </div>
                </div>
            </section>

            <!-- Section 3 — Explore My Work -->
            <section id="portfolio" class="py-5">
                <div class="container py-lg-4">
                    <div class="mb-5 text-center mx-auto" style="max-width: 600px;">
                        <h2 class="fw-bold font-heading mb-2">Explore My Work</h2>
                        <p class="text-muted">A closer look at the digital solutions and customized experiences I
                            create.</p>
                    </div>

                    <!-- Tab navigation or section header for projects vs customer photos -->
                    <h3 class="h4 fw-bold font-heading mb-4"><i class="bi bi-briefcase me-2 text-primary"></i>Featured
                        Projects</h3>
                    <div class="project-carousel mb-5" role="region" aria-label="Featured projects">
                        <div id="projectsContainer" class="project-card-track" role="list" tabindex="0"
                            aria-label="Scrollable project cards">
                            <!-- Dynamically populated by projects.js -->
                        </div>
                        <div id="projectCarouselControls" class="project-carousel-controls justify-content-center gap-2 mt-4" hidden>
                            <button type="button" id="previousProjectBtn"
                                class="btn btn-outline-secondary project-carousel-control" aria-label="Scroll to previous projects">
                                <i class="bi bi-arrow-left" aria-hidden="true"></i>
                            </button>
                            <button type="button" id="nextProjectBtn"
                                class="btn btn-outline-secondary project-carousel-control" aria-label="Scroll to next projects">
                                <i class="bi bi-arrow-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-center mb-6">
                        <button id="loadMoreProjectsBtn" class="btn btn-outline-secondary px-4">Load More
                            Projects</button>
                    </div>

                    <!-- Customer Photos Showcase -->
                    <h3 class="h4 fw-bold font-heading mb-4 mt-5"><i class="bi bi-images me-2 text-primary"></i>Customer
                        NFC Card Moments</h3>
                    <div id="customerPhotosContainer" class="row g-4">
                        <!-- Dynamically populated by projects.js / reviews -->
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer id="contact" class="site-footer bg-surface border-top py-5">
            <div class="container">
                <div class="row align-items-center gy-4">
                    <div class="col-md-6 text-center text-md-start">
                        <a class="navbar-brand fw-bold font-heading text-dark mb-2 d-inline-block" href="#">
                            <span class="text-primary">Jonefer</span> Codillo
                        </a>
                        <p class="text-muted small mb-0">"Building useful digital experiences, one solution at a time."
                        </p>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <div id="socialLinksContainer"
                            class="d-flex justify-content-center justify-content-md-end gap-3 mb-3">
                            <!-- Dynamically rendered social links -->
                        </div>
                        <p class="text-muted small mb-0">&copy; <span id="currentYear"></span> Jonefer Codillo | Freelance Web Developer.</p>
                    </div>
                </div>
            </div>
        </footer>

        <!-- Write a Review Modal -->
        <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold font-heading" id="reviewModalLabel">Write a Review</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body pt-3">
                        <form id="reviewForm" novalidate>
                            <div class="mb-3">
                                <label for="customerName" class="form-label fw-medium">Your Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="customerName" required>
                                <div class="invalid-feedback">Please enter your name.</div>
                            </div>

                            <div class="mb-3">
                                <label for="customerEmail" class="form-label fw-medium">Email Address <span
                                        class="text-muted small">(Optional, private)</span></label>
                                <input type="email" class="form-control" id="customerEmail">
                                <div class="invalid-feedback">Please enter a valid email address.</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-medium d-block">Rating <span
                                        class="text-danger">*</span></label>
                                <div id="starRatingInput" class="star-rating-input fs-3 text-warning" role="radiogroup"
                                    aria-label="Rating">
                                    <i class="bi bi-star" data-rating="1" role="radio" aria-checked="false"
                                        tabindex="0"></i>
                                    <i class="bi bi-star" data-rating="2" role="radio" aria-checked="false"
                                        tabindex="0"></i>
                                    <i class="bi bi-star" data-rating="3" role="radio" aria-checked="false"
                                        tabindex="0"></i>
                                    <i class="bi bi-star" data-rating="4" role="radio" aria-checked="false"
                                        tabindex="0"></i>
                                    <i class="bi bi-star" data-rating="5" role="radio" aria-checked="false"
                                        tabindex="0"></i>
                                </div>
                                <input type="hidden" id="ratingValue" required>
                                <div class="invalid-feedback d-block text-danger" id="ratingError"
                                    style="display:none !important;">Please select a rating.</div>
                            </div>

                            <div class="mb-3">
                                <label for="reviewText" class="form-label fw-medium">Review Text <span
                                        class="text-danger">*</span></label>
                                        <div class="mb-2 d-flex flex-wrap gap-2 align-items-center">
                                            <!-- First 3 Visible Suggestions -->
                                            <button type="button"
                                                class="btn btn-sm btn-outline-secondary text-start review-starter"
                                                data-text="The NFC card is easy to use and makes it simple for customers to find our business online.">"The
                                                NFC card is easy to use..."</button>
                                            <button type="button"
                                                class="btn btn-sm btn-outline-secondary text-start review-starter"
                                                data-text="I love how convenient the card is. Customers can access our review page with just a tap.">"I
                                                love how convenient the card is..."</button>
                                            <button type="button"
                                                class="btn btn-sm btn-outline-secondary text-start review-starter"
                                                data-text="The customized design looks professional, and the setup was straightforward.">"The
                                                customized design looks professional..."</button>

                                    <!-- Additional 3 Hidden Suggestions -->
                                    <div id="hiddenStarters" class="d-none d-flex flex-wrap gap-2 m-0 p-0">
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary text-start review-starter"
                                            data-text="Very happy with how fast customers can leave reviews now. It has boosted our online visibility.">"Very
                                            happy with how fast customers can leave..."</button>
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary text-start review-starter"
                                            data-text="Great build quality and the NFC chip responds instantly every single time.">"Great
                                            build quality and instant response..."</button>
                                        <button type="button"
                                            class="btn btn-sm btn-outline-secondary text-start review-starter"
                                            data-text="A must-have tool for any modern business looking to increase online reviews effortlessly.">"A
                                            must-have tool for any modern business..."</button>
                                    </div>

                                    <!-- "+3 More" Toggle Button -->
                                    <button type="button" id="toggleStartersBtn" class="btn btn-sm btn-link text-decoration-none fw-semibold p-0 ms-1">+3 More</button>
                                </div>
                                <textarea class="form-control" id="reviewText" rows="4" required></textarea>
                                <div class="invalid-feedback">Please enter your review text.</div>
                            </div>
<!-- start -->
                            <!-- <div class="mb-3">
                                <label class="form-label small text-muted fw-semibold">Quick Suggestions (Click to add):</label>
                                <div class="d-flex flex-wrap align-items-center gap-2" id="suggestionsWrapper"> -->
                                    <!-- Initial 3 visible suggestions -->
                                    <!-- <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Fast and reliable service!">⚡ Fast Service</button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Outstanding quality work.">⭐ High Quality</button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Great communication throughout.">💬 Great Communication</button> -->
                                    
                                    <!-- Additional 3 hidden suggestions -->
                                    <!-- <div id="hiddenSuggestions" class="d-none d-flex flex-wrap gap-2 m-0 p-0">
                                        <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Delivered right on time!">⏱️ On Time</button>
                                        <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Very professional and polite.">🤝 Professional</button>
                                        <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill suggestion-chip px-3" data-text="Exceeded my expectations!">🚀 Exceeded Expectations</button>
                                    </div> -->

                                    <!-- "+3 More" Toggle Button -->
                                    <!-- <button type="button" id="toggleSuggestionsBtn" class="btn btn-link btn-sm text-decoration-none fw-semibold p-0 ms-1">+3 More</button>
                                </div>
                            </div> -->
<!-- End -->
                            <div class="mb-3">
                                <label for="reviewPhotos" class="form-label fw-medium">Customer Photos <span
                                        class="text-muted small">(Optional, max 3 images, 10MB each)</span></label>
                                <input type="file" class="form-control" id="reviewPhotos" accept="image/jpeg,image/jpg"
                                    multiple>
                                <div id="photoPreviewContainer" class="d-flex flex-wrap gap-2 mt-2"></div>
                                <div class="invalid-feedback" id="photoError"></div>
                            </div>

                            <div class="alert alert-light border small text-muted mb-4">
                                "Your review may be published after approval. Submitted photos may appear in both the
                                Customer Reviews and Explore My Work sections. Your email address is optional and will
                                not be displayed publicly."
                            </div>

                            <div class="text-end">
                                <button type="button" class="btn btn-secondary me-2"
                                    data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary" id="submitReviewBtn">Submit
                                    Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Project Details Modal -->
        <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 rounded-4 shadow">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h5 class="modal-title fw-bold font-heading" id="projectModalTitle">Project Title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="projectModalBody">
                        <!-- Populated dynamically by projects.js -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Lightbox Modal -->
        <div class="modal fade" id="lightboxModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content bg-transparent border-0">
                    <div class="modal-body text-center position-relative p-0">
                        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                        <img id="lightboxImage" src="" alt="Enlarged view"
                            class="img-fluid rounded-4 max-vh-85 object-fit-contain">
                    </div>
                </div>
            </div>
        </div>

        <!-- JS Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="data/demo-reviews.js"></script>
        <script src="data/demo-projects.js"></script>
        <script src="assets/js/validation.js"></script>
        <script src="assets/js/lightbox.js"></script>
        <script src="assets/js/reviews.js"></script>
        <script src="assets/js/projects.js"></script>
        <script src="assets/js/main.js"></script>
    </body>

</html>