const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.classList.toggle("nav-open", !isOpen);
  });
}

if (nav) {
  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}
