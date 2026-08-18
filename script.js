const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

const enhanceProgramMenus = () => {
  const submenuMarkup = `
    <div class="nav-subgroup">
      <span>Private Coaching</span>
      <a href="private-chess-lessons.html">In-Person Private Coaching</a>
      <a href="online-chess-coaching.html">Online Chess Coaching</a>
      <a href="chess-lessons-with-im-bunmi-olape.html">Lessons with IM Bunmi Olape</a>
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

    let links = card.querySelector(".program-links");
    if (!links) {
      card.querySelector(".text-link")?.remove();
      links = document.createElement("div");
      links.className = "program-links";
      links.innerHTML = `
        <a class="text-link" href="private-chess-lessons.html">In-person coaching</a>
        <a class="text-link" href="online-chess-coaching.html">Online coaching</a>
      `;
      card.append(links);
    }

    if (!links.querySelector('a[href="chess-lessons-with-im-bunmi-olape.html"]')) {
      const bunmiLink = document.createElement("a");
      bunmiLink.className = "text-link";
      bunmiLink.href = "chess-lessons-with-im-bunmi-olape.html";
      bunmiLink.textContent = "Lessons with IM Bunmi Olape";
      links.append(bunmiLink);
    }
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
  link.href = "payment.css?v=bank-transfer";
  document.head.append(link);
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

const getPaymentConfig = () => window.BRUVSCHESS_PAYMENTS;

const isCoachingPaymentPage = () => (
  window.location.pathname.endsWith("/private-chess-lessons.html") ||
  window.location.pathname.endsWith("/online-chess-coaching.html") ||
  window.location.pathname.endsWith("/chess-lessons-with-im-bunmi-olape.html") ||
  window.location.pathname.endsWith("/im-bunmi-olape") ||
  window.location.pathname.endsWith("/im-bunmi-olape/")
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

const renderBankTransferSummaries = () => {
  const bankTransfer = getPaymentConfig()?.bankTransfer;
  if (!bankTransfer) return;

  document.querySelectorAll("[data-bank-transfer-summary]").forEach((summary) => {
    summary.innerHTML = `
      <div>
        <span>Lesson payment options</span>
        <strong>Paystack or bank transfer</strong>
      </div>
      <div>
        <p><b>${bankTransfer.bankName}</b> · ${bankTransfer.accountNumber}</p>
        <small>${bankTransfer.accountName}</small>
      </div>
      <small class="program-payment-reminder">Pay only after your lesson arrangement is confirmed.</small>
    `;
  });
};

const renderPaymentOptions = () => {
  const paymentConfig = getPaymentConfig();
  if (!paymentConfig) return;

  updatePrivateLessonLinks();
  updateLegacyPaymentLinks();
  hideInlinePricingOutsidePrivatePage();
  renderBankTransferSummaries();

  if (!isCoachingPaymentPage()) return;

  document.querySelectorAll("[data-payment-options]").forEach((container) => {
    const serviceKey = container.getAttribute("data-payment-options");
    const service = paymentConfig.services?.[serviceKey];
    const bankTransfer = paymentConfig.bankTransfer;

    if (!service || !bankTransfer) return;

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
    cta.className = "payment-methods";
    cta.innerHTML = `
      <section class="payment-method-card payment-method-online" aria-labelledby="${serviceKey}-paystack-title">
        <span class="payment-method-label">Pay online</span>
        <h3 id="${serviceKey}-paystack-title">Pay securely with Paystack</h3>
        <p>Select your confirmed package on our secure Paystack checkout page.</p>
        <a class="button primary payment-option-link" href="${service.paymentUrl}" target="_blank" rel="noreferrer">Continue to Paystack</a>
      </section>
      <section class="payment-method-card payment-method-transfer" aria-labelledby="${serviceKey}-transfer-title">
        <span class="payment-method-label">Bank transfer</span>
        <h3 id="${serviceKey}-transfer-title">Transfer to our Moniepoint account</h3>
        <dl class="bank-details">
          <div><dt>Account name</dt><dd>${bankTransfer.accountName}</dd></div>
          <div><dt>Account number</dt><dd><strong>${bankTransfer.accountNumber}</strong></dd></div>
          <div><dt>Bank</dt><dd>${bankTransfer.bankName}</dd></div>
        </dl>
        <button class="button secondary copy-account-number" type="button" data-account-number="${bankTransfer.accountNumber}">Copy account number</button>
        <p class="transfer-note">Pay only after your lesson arrangement is confirmed. Use the learner's full name as the transfer narration, then send proof of payment to <a href="mailto:info@bruvschess.org">info@bruvschess.org</a>.</p>
        <p class="copy-status" role="status" aria-live="polite"></p>
      </section>
    `;
    container.after(cta);
  });
};

document.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest(".copy-account-number");
  if (!button) return;

  const accountNumber = button.dataset.accountNumber;
  const status = button.parentElement?.querySelector(".copy-status");

  try {
    await navigator.clipboard.writeText(accountNumber);
    button.textContent = "Account number copied";
    if (status) status.textContent = "The Moniepoint account number has been copied.";
  } catch {
    if (status) status.textContent = `Copy this account number: ${accountNumber}`;
  }
});

const loadPaymentConfig = () => {
  if (getPaymentConfig()) {
    loadPaymentStyles();
    renderPaymentOptions();
    return;
  }

  const script = document.createElement("script");
  script.src = "payment-config.js?v=bank-transfer";
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
