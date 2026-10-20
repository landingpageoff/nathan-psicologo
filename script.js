"use strict";

document.documentElement.classList.add("js-enabled");

const header = document.querySelector(".site-header");
const progressBar = document.querySelector("#progress-bar");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#menu-principal");
const menuLinks = document.querySelectorAll(".nav-panel a");
const portraitImage = document.querySelector(".portrait-image");
const year = document.querySelector("#current-year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function updateScrollUI() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  updateScrollUI();
  if (window.innerWidth > 760) closeMenu();
});
updateScrollUI();

function closeMenu() {
  if (!menuToggle || !navPanel) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navPanel.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navPanel.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if (portraitImage) {
  const hideUnavailablePortrait = () => {
    portraitImage.classList.add("is-hidden");
  };

  portraitImage.addEventListener("error", hideUnavailablePortrait);
  if (portraitImage.complete && portraitImage.naturalWidth === 0) {
    hideUnavailablePortrait();
  }
}

const revealElements = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}