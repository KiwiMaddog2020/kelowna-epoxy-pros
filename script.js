const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");
const compare = document.querySelector("[data-compare]");
const compareRange = document.querySelector("[data-compare-range]");
const finishButtons = document.querySelectorAll("[data-finish]");
const finishTitle = document.querySelector("[data-finish-title]");
const finishDescription = document.querySelector("[data-finish-description]");
const finishSource = document.querySelector("[data-finish-source]");
const finishImage = document.querySelector("[data-finish-image]");
const finishCaption = document.querySelector("[data-finish-caption]");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");

const finishes = {
  graphite: {
    title: "Graphite Flake",
    description: "A confident garage and shop look with charcoal depth, bright flake, and enough variation to hide everyday dust between cleanups.",
    webp: "assets/finish-flake.webp",
    image: "assets/finish-flake.png",
    alt: "Graphite flake epoxy floor finish",
    caption: "Best first fit for garages, workshops, and storage rooms."
  },
  stone: {
    title: "Light Stone",
    description: "A brighter finish that helps a garage or basement feel cleaner without turning every mark into the first thing you notice.",
    webp: "assets/garage-floor.webp",
    image: "assets/garage-floor.png",
    alt: "Light stone epoxy floor finish",
    caption: "Good for garages, basements, laundry spaces, and cleaner storage rooms."
  },
  commercial: {
    title: "Commercial Gray",
    description: "A practical, harder-working direction for shops, service areas, storage rooms, and small commercial spaces.",
    webp: "assets/shop-floor.webp",
    image: "assets/shop-floor.png",
    alt: "Commercial gray epoxy floor finish",
    caption: "Built for work areas where cleaning, traffic, and utility matter."
  }
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  if (!menuToggle || !primaryNav || !header) return;
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  header.classList.remove("is-open");
  document.body.classList.remove("is-menu-open");
}

function selectFinish(button, moveFocus = false) {
  const key = button.dataset.finish;
  const finish = finishes[key];
  if (!finish || !finishTitle || !finishDescription || !finishImage || !finishCaption) return;

  finishButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  finishTitle.textContent = finish.title;
  finishDescription.textContent = finish.description;
  if (finishSource) finishSource.srcset = finish.webp;
  finishImage.src = finish.image;
  finishImage.alt = finish.alt;
  finishCaption.textContent = finish.caption;
  if (moveFocus) button.focus();
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle && primaryNav && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
    header.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("is-menu-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("click", (event) => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    const target = event.target;
    if (!isOpen || !(target instanceof Element)) return;
    if (target.closest("[data-primary-nav]") || target.closest("[data-menu-toggle]")) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if (compare && compareRange) {
  const syncCompare = () => {
    compare.style.setProperty("--position", `${compareRange.value}%`);
  };

  compareRange.addEventListener("input", syncCompare);
  syncCompare();
}

finishButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectFinish(button);
  });

  button.addEventListener("keydown", (event) => {
    const navigationKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!navigationKeys.includes(event.key)) return;

    event.preventDefault();
    const buttons = Array.from(finishButtons);
    const currentIndex = buttons.indexOf(button);
    const lastIndex = buttons.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (event.key === "ArrowLeft") nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    if (event.key === "ArrowRight") nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;

    selectFinish(buttons[nextIndex], true);
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    item.classList.toggle("is-open", !isOpen);
  });
});

if (quoteForm && formNote) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Thanks. The form is ready for final routing before public lead capture.";
    formNote.setAttribute("role", "status");
  });
}
