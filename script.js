document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initReveal();
  initProductGalleries();
  initReviewsSlider();
  initBouquetCategoriesSlider();
  initQuickChoiceFilters();
  initFeaturedSection();
  initQuickChoiceSlider();
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
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
}

function initProductGalleries() {
  const cards = document.querySelectorAll(".signature-card, .catalog-card");

  cards.forEach((card) => {
    const images = card.querySelectorAll(".product-image");
    const dotsWrap = card.querySelector(".product-dots");

    if (!images.length || !dotsWrap) return;

    let current = 0;
    dotsWrap.innerHTML = "";

    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "product-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Фото ${index + 1}`);

      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

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

function initReviewsSlider() {
  const slider = document.querySelector("[data-reviews-slider]");
  if (!slider) return;

  const track = slider.querySelector(".reviews-slider__track");
  const cards = Array.from(slider.querySelectorAll(".review-card"));
  const prevBtn = slider.querySelector(".reviews-slider__btn--prev");
  const nextBtn = slider.querySelector(".reviews-slider__btn--next");

  if (!track || !cards.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);
    const cardWidth = cards[0].offsetWidth;
    const gap = 18;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex -= 1;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex += 1;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
}

function initBouquetCategoriesSlider() {
  const slider = document.querySelector(".bouquet-categories__slider");
  if (!slider) return;

  const track = slider.querySelector(".bouquet-categories__track");
  const cards = Array.from(slider.querySelectorAll(".bouquet-category-tile"));
  const prevBtn = slider.querySelector(".bouquet-categories__nav--prev");
  const nextBtn = slider.querySelector(".bouquet-categories__nav--next");

  if (!track || !cards.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 4;
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);
    const cardWidth = cards[0].offsetWidth;
    const gap = 18;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex -= 1;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex += 1;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
}

function initQuickChoiceFilters() {
  const tabs = document.querySelectorAll(".quick-choice__tab");
  const minInput = document.getElementById("priceMin");
  const maxInput = document.getElementById("priceMax");
  const minValue = document.getElementById("priceMinValue");
  const maxValue = document.getElementById("priceMaxValue");
  const rangeFill = document.getElementById("priceRangeFill");
  const cards = document.querySelectorAll("#catalogGrid .catalog-card");

  if (!tabs.length || !minInput || !maxInput || !minValue || !maxValue || !rangeFill || !cards.length) {
    return;
  }

  let activeCategory = "all";
  const minGap = 500;
  const minLimit = Number(minInput.min);
  const maxLimit = Number(maxInput.max);

  minInput.value = minLimit;
  if (!maxInput.value || Number(maxInput.value) < minLimit) {
    maxInput.value = maxLimit;
  }

  function normalizeCategory(value) {
    if (value === "boxes") return "box";
    return value;
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  }

  function applyFilters() {
    const minPrice = Number(minInput.value);
    const maxPrice = Number(maxInput.value);

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const price = Number(card.dataset.price || 0);

      const categoryMatch =
        activeCategory === "all" || category === normalizeCategory(activeCategory);

      const priceMatch = price >= minPrice && price <= maxPrice;

      card.style.display = categoryMatch && priceMatch ? "" : "none";
    });
  }

  function updateRange(changedInput = null) {
    let minVal = Number(minInput.value);
    let maxVal = Number(maxInput.value);

    if (maxVal - minVal < minGap) {
      if (changedInput === minInput) {
        minVal = maxVal - minGap;
        minInput.value = minVal;
      } else {
        maxVal = minVal + minGap;
        maxInput.value = maxVal;
      }
    }

    minValue.textContent = formatPrice(minVal);
    maxValue.textContent = formatPrice(maxVal);

    const left = ((minVal - minLimit) / (maxLimit - minLimit)) * 100;
    const right = ((maxVal - minLimit) / (maxLimit - minLimit)) * 100;

    rangeFill.style.left = `${left}%`;
    rangeFill.style.width = `${right - left}%`;

    applyFilters();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      tabs.forEach((btn) => btn.classList.remove("is-active"));
      tab.classList.add("is-active");
      activeCategory = tab.dataset.filter || "all";
      applyFilters();
    });
  });

  minInput.addEventListener("input", () => updateRange(minInput));
  maxInput.addEventListener("input", () => updateRange(maxInput));

  updateRange();
}

document.addEventListener("DOMContentLoaded", () => {
  initQuickChoiceSlider(); // Инициализация слайдера для хитовых позиций
});

function initQuickChoiceSlider() {
  const prevBtn = document.querySelector(".featured-carousel__nav--prev");
  const nextBtn = document.querySelector(".featured-carousel__nav--next");
  const track = document.querySelector(".featured-carousel__track");
  const items = document.querySelectorAll(".catalog-card");
  
  if (!track || !prevBtn || !nextBtn || !items.length) return;

  let currentIndex = 0;
  const itemsPerPage = 3; // Три товара в одном ряду
  
  function updateSlider() {
    const totalItems = items.length;
    const maxIndex = totalItems - itemsPerPage;
    const offset = currentIndex * (items[0].offsetWidth + 16); // Учитываем gap в 16px между товарами

    track.style.transform = `translateX(-${offset}px)`;

    // Управляем активностью кнопок
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < items.length - itemsPerPage) {
      currentIndex++;
      updateSlider();
    }
  });

  updateSlider();
}