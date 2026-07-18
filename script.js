const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

const enhanceProgramMenus = () => {
  const submenuMarkup = `
    <div class="nav-subgroup">
      <span>Private Coaching</span>
      <a href="private-chess-lessons.html">In-Person Private Coaching</a>
      <a href="online-chess-coaching.html">Online Chess Coaching</a>
    </div>
  `;

  document.querySelectorAll(".site-nav").forEach((siteNav) => {
    const existing = siteNav.querySelector(".has-submenu");
    if (existing) {
      const submenu = existing.querySelector(".nav-submenu");
      const parent = existing.querySelector("a");

      existing.classList.add("nav-item", "has-submenu");
      parent?.classList.add("nav-parent");
      if (submenu) submenu.innerHTML = submenuMarkup;
      return;
    }

    const programLink = Array.from(siteNav.querySelectorAll("a")).find((link) => link.textContent.trim() === "Programs");
    if (!programLink) return;

    const item = document.createElement("div");
    item.className = "nav-item has-submenu";

    const parent = programLink.cloneNode(true);
    parent.classList.add("nav-parent");

    const submenu = document.createElement("div");
    submenu.className = "nav-submenu";
    submenu.innerHTML = submenuMarkup;

    item.append(parent, submenu);
    programLink.replaceWith(item);
  });
};

enhanceProgramMenus();

const enhancePrivateCoachingCards = () => {
  document.querySelectorAll(".program-card").forEach((card) => {
    const heading = card.querySelector("h3");
    if (!heading || heading.textContent.trim() !== "Private Coaching") return;
    if (card.querySelector(".program-links")) return;

    const oldLink = card.querySelector(".text-link");
    oldLink?.remove();

    const links = document.createElement("div");
    links.className = "program-links";
    links.innerHTML = `
      <a class="text-link" href="private-chess-lessons.html">In-person coaching</a>
      <a class="text-link" href="online-chess-coaching.html">Online coaching</a>
    `;
    card.append(links);
  });
};

enhancePrivateCoachingCards();

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

const loadPaymentStyles = () => {
  if (document.querySelector('link[href$="payment.css"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "payment.css?v=payment-flow";
  document.head.append(link);
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

const getPaymentConfig = () => window.BRUVSCHESS_PAYMENTS;

const isCoachingPaymentPage = () => (
  window.location.pathname.endsWith("/private-chess-lessons.html") ||
  window.location.pathname.endsWith("/online-chess-coaching.html")
);

const updatePrivateLessonLinks = () => {
  document.querySelectorAll('a[href="chess-lessons-abuja.html"]').forEach((link) => {
    const text = link.textContent.toLowerCase();
    if (text.includes("private")) link.href = "private-chess-lessons.html";
  });
};

const updateLegacyPaymentLinks = () => {
  document.querySelectorAll(".paystack-link").forEach((link) => {
    link.href = "private-chess-lessons.html";
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.textContent = "View private lesson options";
  });
};

const hideInlinePricingOutsidePrivatePage = () => {
  if (isCoachingPaymentPage()) return;

  document.querySelectorAll("[data-payment-options]").forEach((container) => {
    const copy = container.closest(".private-lessons-copy");
    const paymentCopy = copy?.querySelector(".payment-copy");
    const link = document.createElement("a");

    link.className = "button secondary";
    link.href = "private-chess-lessons.html";
    link.textContent = "View private lesson options";

    if (paymentCopy) paymentCopy.remove();
    container.replaceWith(link);
  });
};

const renderPaymentOptions = () => {
  const paymentConfig = getPaymentConfig();
  if (!paymentConfig) return;

  updatePrivateLessonLinks();
  updateLegacyPaymentLinks();
  hideInlinePricingOutsidePrivatePage();

  if (!isCoachingPaymentPage()) return;

  document.querySelectorAll("[data-payment-options]").forEach((container) => {
    const serviceKey = container.getAttribute("data-payment-options");
    const service = paymentConfig.services?.[serviceKey];

    if (!service) return;

    container.innerHTML = "";
    container.setAttribute("aria-label", `${service.serviceName} payment options`);

    service.packages.forEach((item) => {
      const perSession = item.sessions > 1 ? Math.round(item.price / item.sessions) : null;
      const card = document.createElement("article");
      card.className = "payment-option-card";

      const priceSuffixText = item.priceSuffix ? `<small>${item.priceSuffix}</small>` : "";
      const perSessionText = perSession && !item.priceSuffix
        ? `<small>${formatNaira(perSession)} per session</small>`
        : "<small>Single coaching session</small>";

      card.innerHTML = `
        <div>
          <span>${item.label}</span>
          <h3>${item.name}</h3>
        </div>
        <strong>${formatNaira(item.price)}</strong>
        ${priceSuffixText || perSessionText}
        <p>${item.description}</p>
      `;

      container.append(card);
    });

    const cta = document.createElement("div");
    cta.className = "payment-shared-cta";
    cta.innerHTML = `
      <p>All packages use one secure booking page. Select your preferred package after clicking the button.</p>
      <a class="button primary payment-option-link" href="${service.paymentUrl}" target="_blank" rel="noreferrer">Continue to booking</a>
    `;
    container.after(cta);
  });
};

const loadPaymentConfig = () => {
  if (getPaymentConfig()) {
    loadPaymentStyles();
    renderPaymentOptions();
    return;
  }

  const script = document.createElement("script");
  script.src = "payment-config.js?v=payment-flow";
  script.onload = () => {
    loadPaymentStyles();
    renderPaymentOptions();
  };
  document.head.append(script);
};

loadPaymentConfig();
updatePrivateLessonLinks();
updateLegacyPaymentLinks();
hideInlinePricingOutsidePrivatePage();
