const themeStorageKey = "ymz-blog-theme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  const themeToggleIcon = document.querySelector(".theme-toggle-icon");
  const themeToggleText = document.querySelector(".theme-toggle-text");

  root.dataset.theme = theme;

  if (!themeToggleIcon || !themeToggleText) {
    return;
  }

  const isDark = theme === "dark";
  themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
  themeToggleText.textContent = isDark ? "浅色" : "深色";
}

export function initTheme() {
  const themeToggle = document.querySelector("[data-theme-toggle]");

  applyTheme(getPreferredTheme());

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}
