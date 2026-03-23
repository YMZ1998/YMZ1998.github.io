const themeStorageKey = "ymz-blog-theme";

const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleText = document.querySelector(".theme-toggle-text");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.dataset.theme = theme;

  if (!themeToggleIcon || !themeToggleText) {
    return;
  }

  const isDark = theme === "dark";
  themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
  themeToggleText.textContent = isDark ? "浅色" : "深色";
}

function toggleTheme() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
}

function closeNav() {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

function setupMobileNav() {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeNav();
    }
  });
}

function setupPostFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-post-card]");

  if (!buttons.length || !cards.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const tag = card.dataset.tag;
        const visible = filter === "all" || tag === filter;
        card.classList.toggle("is-hidden", !visible);
      });
    });
  });
}

function debounce(callback, delay = 120) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function setupPhotoPagination() {
  const gallery = document.querySelector("[data-photo-gallery]");
  const items = Array.from(gallery?.querySelectorAll("[data-photo-item]") || []);
  const prevButton = document.querySelector("[data-photo-prev]");
  const nextButton = document.querySelector("[data-photo-next]");
  const status = document.querySelector("[data-photo-status]");
  const dots = document.querySelector("[data-photo-dots]");

  if (!gallery || !items.length || !prevButton || !nextButton || !status || !dots) {
    return;
  }

  let currentPage = 0;
  let itemsPerPage = 3;

  const getItemsPerPage = () => {
    if (window.innerWidth <= 820) {
      return 1;
    }

    if (window.innerWidth <= 1100) {
      return 2;
    }

    return 3;
  };

  const getTotalPages = () => Math.max(1, Math.ceil(items.length / itemsPerPage));

  const renderDots = (totalPages) => {
    dots.innerHTML = "";

    for (let index = 0; index < totalPages; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "photo-page-dot";
      dot.setAttribute("aria-label", `跳转到第 ${index + 1} 页`);
      dot.classList.toggle("is-active", index === currentPage);
      dot.addEventListener("click", () => {
        currentPage = index;
        render();
      });
      dots.appendChild(dot);
    }
  };

  const render = () => {
    itemsPerPage = getItemsPerPage();
    const totalPages = getTotalPages();
    currentPage = Math.min(currentPage, totalPages - 1);

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;

    items.forEach((item, index) => {
      const visible = index >= start && index < end;
      item.hidden = !visible;
      item.classList.toggle("is-hidden", !visible);
    });

    status.textContent = `第 ${currentPage + 1} / ${totalPages} 页`;
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
    renderDots(totalPages);
  };

  prevButton.addEventListener("click", () => {
    if (currentPage === 0) {
      return;
    }

    currentPage -= 1;
    render();
  });

  nextButton.addEventListener("click", () => {
    const totalPages = getTotalPages();
    if (currentPage >= totalPages - 1) {
      return;
    }

    currentPage += 1;
    render();
  });

  window.addEventListener("resize", debounce(() => {
    const firstVisibleIndex = currentPage * itemsPerPage;
    itemsPerPage = getItemsPerPage();
    currentPage = Math.floor(firstVisibleIndex / itemsPerPage);
    render();
  }));

  render();
}

function setupScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");

  if (!progressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const width = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressBar.style.width = `${width}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setupArticleToc() {
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

function setupArticleTimeline() {
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

applyTheme(getPreferredTheme());
themeToggle?.addEventListener("click", toggleTheme);
setupMobileNav();
setupPostFilters();
setupPhotoPagination();
setupScrollProgress();
setCurrentYear();
setupArticleToc();
setupArticleTimeline();
