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

const loadPaymentStyles = () => {
  if (document.querySelector('link[href$="payment.css"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "payment.css?v=payment-flow";
  document.head.append(link);
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

const getPaymentConfig = () => window.BRUVSCHESS_PAYMENTS;

const isPrivateLessonsPage = () => window.location.pathname.endsWith("/private-chess-lessons.html");

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
  if (isPrivateLessonsPage()) return;

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

  if (!isPrivateLessonsPage()) return;

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

      const perSessionText = perSession
        ? `<small>${formatNaira(perSession)} per session</small>`
        : "<small>Single coaching session</small>";

      card.innerHTML = `
        <div>
          <span>${item.label}</span>
          <h3>${item.name}</h3>
        </div>
        <strong>${formatNaira(item.price)}</strong>
        ${perSessionText}
        <p>${item.description}</p>
        <a class="button secondary payment-option-link" href="${service.paymentUrl}" target="_blank" rel="noreferrer">Pay after confirmation</a>
      `;

      container.append(card);
    });
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
