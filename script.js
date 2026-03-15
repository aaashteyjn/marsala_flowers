document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initReveal();
  initProductGalleries();
  initCatalogFilter();
});

function initBurger() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
}

function initProductGalleries() {
  const galleries = document.querySelectorAll(".signature-card, .catalog-card");

  galleries.forEach((card) => {
    const images = card.querySelectorAll(".product-image");
    const dotsWrap = card.querySelector(".product-dots");

    if (!images.length || !dotsWrap) return;

    let current = 0;

    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "product-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Фото ${index + 1}`);

      dot.addEventListener("click", () => {
        images[current].classList.remove("active");
        dotsWrap.children[current].classList.remove("active");

        current = index;

        images[current].classList.add("active");
        dotsWrap.children[current].classList.add("active");
      });

      dotsWrap.appendChild(dot);
    });
  });
}

function initCatalogFilter() {
  const typeButtons = document.querySelectorAll("[data-filter-type]");
  const priceButtons = document.querySelectorAll("[data-filter-price]");
  const cards = document.querySelectorAll("#catalogGrid .catalog-card");

  if (!cards.length) return;

  let activeType = "all";
  let activePrice = "all";

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      typeButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activeType = button.dataset.filterType;
      applyFilters();
    });
  });

  priceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priceButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activePrice = button.dataset.filterPrice;
      applyFilters();
    });
  });

  function applyFilters() {
    cards.forEach((card) => {
      const category = card.dataset.category;
      const price = Number(card.dataset.price);

      const typeMatch = activeType === "all" || category === activeType;
      const priceMatch = matchPrice(price, activePrice);

      card.style.display = typeMatch && priceMatch ? "" : "none";
    });
  }

  function matchPrice(price, range) {
    switch (range) {
      case "low":
        return price < 4000;
      case "mid":
        return price >= 4000 && price <= 7000;
      case "high":
        return price > 7000;
      default:
        return true;
    }
  }
}