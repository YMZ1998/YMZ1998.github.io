export function initArticleToc() {
  const article = document.querySelector(".article-content");
  const tocSections = Array.from(document.querySelectorAll("[data-article-toc-section]"));
  const tocContainers = Array.from(document.querySelectorAll("[data-article-toc]"));

  if (!article || !tocSections.length || !tocContainers.length) {
    return;
  }

  const headings = Array.from(article.querySelectorAll("h2, h3")).filter((heading) => heading.textContent.trim());

  if (!headings.length) {
    return;
  }

  tocContainers.forEach((toc) => {
    toc.innerHTML = "";
  });

  const usedIds = new Set();

  headings.forEach((heading, index) => {
    if (!heading.id) {
      let nextId = `section-${index + 1}`;

      while (usedIds.has(nextId) || document.getElementById(nextId)) {
        nextId = `${nextId}-copy`;
      }

      heading.id = nextId;
    }

    usedIds.add(heading.id);

    tocContainers.forEach((toc) => {
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      link.dataset.level = heading.tagName === "H2" ? "2" : "3";
      toc.appendChild(link);
    });
  });

  tocSections.forEach((section) => {
    section.hidden = false;
  });

  const links = Array.from(document.querySelectorAll("[data-article-toc] a"));

  const updateActiveLink = () => {
    const offset = 140;
    let activeId = headings[0].id;

    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top - offset <= 0) {
        activeId = heading.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
}
