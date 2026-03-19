document.addEventListener("DOMContentLoaded", () => {
  initBurger();
  initReveal();
  initProductGalleries();
  initReviewsSlider();
  initPriceSlider();
  initBouquetCategoriesSlider();
});

function initBurger() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => nav.classList.toggle("is-open"));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
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
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 980) return 2;
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

function initPriceSlider() {
  const minInput = document.getElementById("priceMin");
  const maxInput = document.getElementById("priceMax");
  const minValue = document.getElementById("priceMinValue");
  const maxValue = document.getElementById("priceMaxValue");
  const rangeFill = document.getElementById("priceRangeFill");

  if (!minInput || !maxInput || !minValue || !maxValue || !rangeFill) return;

  const minLimit = Number(minInput.min);
  const maxLimit = Number(minInput.max);
  const minGap = 500;

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  }

  function updateSlider(changedInput = null) {
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

    filterCardsByPrice(minVal, maxVal);
  }

  minInput.addEventListener("input", () => updateSlider(minInput));
  maxInput.addEventListener("input", () => updateSlider(maxInput));

  updateSlider();
}

function filterCardsByPrice(minPrice, maxPrice) {
  const cards = document.querySelectorAll(".catalog-card, .signature-card, .product-card");

  cards.forEach((card) => {
    const rawPrice = card.dataset.price;
    if (!rawPrice) return;

    const price = Number(rawPrice);

    if (price >= minPrice && price <= maxPrice) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

