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

const paymentConfig = window.BRUVSCHESS_PAYMENTS;

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

const renderPaymentOptions = () => {
  if (!paymentConfig) return;

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

renderPaymentOptions();
