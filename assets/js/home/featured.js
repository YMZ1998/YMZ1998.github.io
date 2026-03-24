export function initHomeFeatured() {
  const cards = document.querySelectorAll(".hub-card");

  cards.forEach((card) => {
    const link = card.querySelector(".text-link");

    if (!link) {
      return;
    }

    card.addEventListener("click", (event) => {
      const target = event.target;

      if (target instanceof HTMLElement && target.closest("a")) {
        return;
      }

      window.location.href = link.href;
    });

    card.tabIndex = 0;
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = link.href;
      }
    });
  });
}
