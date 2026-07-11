export function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");

  if (!progressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}
