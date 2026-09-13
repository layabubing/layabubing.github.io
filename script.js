const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll(".paper section[id]");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

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
