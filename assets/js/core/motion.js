const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function initScrollReveal() {
  const revealGroups = [
    ".hero-grid > *",
    ".section-heading",
    ".focus-card",
    ".post-card",
    ".project-card",
    ".photo-card",
    ".hub-card",
    ".listing-sidebar",
    ".article-header",
    ".article-content",
    ".detail-header",
    ".detail-prose",
    ".detail-side-card",
  ];

  const elements = [...document.querySelectorAll(revealGroups.join(", "))];

  elements.forEach((element, index) => {
    element.classList.add("motion-enter");
    element.style.setProperty("--motion-delay", `${(index % 3) * 70}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8%",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

function initHeaderMotion() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  let frame = 0;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    frame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateHeader);
      }
    },
    { passive: true },
  );

  updateHeader();
}

function initHeroTilt() {
  const panel = document.querySelector("body[data-page='home'] .hero-panel");
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 821px)");

  if (!panel || !canTilt.matches) {
    return;
  }

  panel.classList.add("motion-tilt");

  panel.addEventListener("pointermove", (event) => {
    const bounds = panel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    panel.style.setProperty("--tilt-x", `${(-y * 2.4).toFixed(2)}deg`);
    panel.style.setProperty("--tilt-y", `${(x * 3.2).toFixed(2)}deg`);
    panel.style.setProperty("--glow-shift", `${(x * 8).toFixed(1)}px`);
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.removeProperty("--tilt-x");
    panel.style.removeProperty("--tilt-y");
    panel.style.removeProperty("--glow-shift");
  });
}

export function initMotion() {
  if (reduceMotionQuery.matches) {
    document.documentElement.classList.add("reduced-motion");
    return;
  }

  document.documentElement.classList.add("motion-enabled");
  initScrollReveal();
  initHeaderMotion();
  initHeroTilt();
}
