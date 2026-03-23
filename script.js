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
  const tocSection = document.querySelector("[data-article-toc-section]");
  const toc = document.querySelector("[data-article-toc]");

  if (!article || !tocSection || !toc) {
    return;
  }

  const headings = Array.from(article.querySelectorAll("h2, h3")).filter((heading) => heading.textContent.trim());

  if (!headings.length) {
    return;
  }

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

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    link.dataset.level = heading.tagName === "H2" ? "2" : "3";
    toc.appendChild(link);
  });

  tocSection.hidden = false;

  const links = Array.from(toc.querySelectorAll("a"));

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

applyTheme(getPreferredTheme());
themeToggle?.addEventListener("click", toggleTheme);
setupMobileNav();
setupPostFilters();
setupScrollProgress();
setCurrentYear();
setupArticleToc();
