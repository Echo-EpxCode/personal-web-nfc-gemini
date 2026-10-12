function openLightbox(imageSrc) {
    const lightboxImg = document.getElementById("lightboxImage");
    if (!lightboxImg) return;
    lightboxImg.src = imageSrc;
    const lightboxModal = new bootstrap.Modal(document.getElementById("lightboxModal"));
    lightboxModal.show();
}
