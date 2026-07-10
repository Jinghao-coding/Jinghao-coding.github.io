(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const year = document.getElementById("year");

  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navLinks.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }

  menuToggle.addEventListener("click", function () {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 820) {
      setMenu(false);
    }
  });

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if ("IntersectionObserver" in window) {
    const observedSections = sectionLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          sectionLinks.forEach(function (link) {
            const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            if (isCurrent) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    observedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
