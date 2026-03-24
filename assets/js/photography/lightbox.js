export function initPhotoLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  const image = lightbox?.querySelector("[data-lightbox-image]");
  const title = lightbox?.querySelector("[data-lightbox-title]");
  const downloadLink = lightbox?.querySelector("[data-lightbox-download]");
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");
  const closeButtons = document.querySelectorAll("[data-lightbox-close]");

  if (!lightbox || !image || !title || !downloadLink || !triggers.length) {
    return;
  }

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("is-lightbox-open");
    image.removeAttribute("src");
    image.alt = "";
    title.textContent = "";
    downloadLink.removeAttribute("href");
  };

  const openLightbox = (trigger) => {
    const src = trigger.dataset.lightboxSrc;
    const alt = trigger.dataset.lightboxAlt || "";
    const heading = trigger.dataset.lightboxTitle || alt;

    if (!src) {
      return;
    }

    image.src = src;
    image.alt = alt;
    title.textContent = heading;
    downloadLink.href = src;
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
