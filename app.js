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

  /* ---------- Opening hours (real posted hours: 14:00-21:00, onsdag-søndag) ---------- */
  // Index 0 = Monday ... 6 = Sunday. null = closed.
  var HOURS = {
    potetbua: [
      null,
      null,
      { open: "14:00", close: "21:00" },
      { open: "14:00", close: "21:00" },
      { open: "14:00", close: "21:00" },
      { open: "14:00", close: "21:00" },
      { open: "14:00", close: "21:00" }
    ]
  };

  function toMinutes(hhmm) {
    var parts = hhmm.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function isOpenNow(weekHours) {
    var now = new Date();
    var jsDay = now.getDay(); // 0=Sun..6=Sat
    var todayIdx = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon..6=Sun
    var yesterdayIdx = todayIdx === 0 ? 6 : todayIdx - 1;
    var minutesNow = now.getHours() * 60 + now.getMinutes();

    var today = weekHours[todayIdx];
    if (today) {
      var open = toMinutes(today.open);
      var close = toMinutes(today.close);
      if (close <= open) {
        if (minutesNow >= open) return true;
      } else if (minutesNow >= open && minutesNow < close) {
        return true;
      }
    }
    var prev = weekHours[yesterdayIdx];
    if (prev) {
      var pOpen = toMinutes(prev.open);
      var pClose = toMinutes(prev.close);
      if (pClose <= pOpen && minutesNow < pClose) return true;
    }
    return false;
  }

  document.querySelectorAll("[data-hours]").forEach(function (pill) {
    var key = pill.getAttribute("data-hours");
    var weekHours = HOURS[key];
    if (!weekHours) return;
    var open = isOpenNow(weekHours);
    pill.classList.add(open ? "is-open" : "is-closed");
    pill.innerHTML = '<span class="dot"></span>' + (open ? "Åpent nå" : "Stengt nå");
  });

  var jsToday = new Date().getDay();
  var isoToday = String(jsToday === 0 ? 7 : jsToday);
  document.querySelectorAll(".hour-row[data-day]").forEach(function (row) {
    if (row.getAttribute("data-day") === isoToday) {
      row.classList.add("today");
    }
  });
})();
