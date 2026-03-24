function debounce(callback, delay = 120) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function initPhotoPagination() {
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
