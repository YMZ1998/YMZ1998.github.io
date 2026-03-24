import { initTheme } from "./core/theme.js";
import { initMobileNav } from "./core/navigation.js";
import { initScrollProgress } from "./core/scroll-progress.js";
import { initYear } from "./core/year.js";
import { initPostFilters } from "./articles/filters.js";
import { initArticleToc } from "./articles/toc.js";
import { initArticleTimeline } from "./articles/timeline.js";
import { initPhotoPagination } from "./photography/pagination.js";
import { initHomeFeatured } from "./home/featured.js";

const page = document.body?.dataset.page;

initTheme();
initMobileNav();
initScrollProgress();
initYear();

if (page === "home") {
  initHomeFeatured();
}

if (page === "articles") {
  initPostFilters();
}

if (page === "post") {
  initArticleToc();
  initArticleTimeline();
}

if (page === "photography") {
  initPhotoPagination();
}
