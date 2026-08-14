const header = document.querySelector(".site-header");
const themeToggle = document.querySelector("#theme-toggle");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll(".paper section[id]");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const getStoredTheme = () => localStorage.getItem("layabubing-theme");

const applyTheme = (theme, persist = false) => {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    const isLight = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "切换深色模式" : "切换浅色模式");
    themeToggle.querySelector("span").textContent = isLight ? "DARK" : "LIGHT";
  }

  if (persist) {
    localStorage.setItem("layabubing-theme", theme);
  }
};

const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const urlTheme = new URLSearchParams(window.location.search).get("theme");
const initialTheme = urlTheme === "light" || urlTheme === "dark" ? urlTheme : getStoredTheme() || preferredTheme;
applyTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(nextTheme, true);
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -36px" },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;

    navLinks.forEach((link) => {
      link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -60%", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));
