export function initArticleTimeline() {
  const currentLinks = document.querySelectorAll(".article-timeline-link.is-current");

  currentLinks.forEach((link) => {
    const container = link.closest(".article-sidebar, .article-timeline-mobile");

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      link.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  });
}
