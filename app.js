(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mainNav = document.querySelector(".main-nav");
  var scrim = document.querySelector(".nav-scrim");
  var menuClose = document.querySelector(".menu-close");

  function openNav() {
    mainNav.classList.add("is-open");
    hamburger.classList.add("is-active");
    scrim.classList.add("is-visible");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mainNav.classList.remove("is-open");
    hamburger.classList.remove("is-active");
    scrim.classList.remove("is-visible");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (hamburger && mainNav) {
    hamburger.addEventListener("click", function () {
      mainNav.classList.contains("is-open") ? closeNav() : openNav();
    });
  }
  if (scrim) scrim.addEventListener("click", closeNav);
  if (menuClose) menuClose.addEventListener("click", closeNav);
  mainNav && mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.innerWidth <= 960) closeNav();
    });
  });

  /* ---------- Active link on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".main-nav a[href*='#']");
  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            var match = a.getAttribute("href").indexOf("#" + id) !== -1;
            a.classList.toggle("active", match);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

})();
