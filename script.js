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

const ensureLegacyPaymentSection = (service) => {
  document.querySelectorAll(".paystack-link").forEach((link) => {
    link.href = service.paymentUrl;
    link.textContent = "Pay after confirmation";

    const copy = link.closest(".private-lessons-copy");
    if (!copy || copy.querySelector("[data-payment-options]")) return;

    const paymentCopy = document.createElement("div");
    paymentCopy.className = "payment-copy";
    paymentCopy.innerHTML = `
      <strong>Current in-person coaching options</strong>
      <p>After BruvsChess confirms the learner's needs, coaching format, location, and schedule, customers can complete payment securely through Paystack.</p>
    `;

    const options = document.createElement("div");
    options.className = "payment-options";
    options.dataset.paymentOptions = "privateCoaching";

    link.replaceWith(paymentCopy, options);
  });
};

const renderPaymentOptions = () => {
  const paymentConfig = getPaymentConfig();
  if (!paymentConfig) return;

  const privateCoaching = paymentConfig.services?.privateCoaching;
  if (privateCoaching) ensureLegacyPaymentSection(privateCoaching);

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
