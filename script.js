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
  if (document.querySelector('link[href*="payment.css"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "payment.css?v=coach-profiles";
  document.head.append(link);
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

const getCoachingConfig = () => window.BRUVSCHESS_COACHING;

const updatePrivateLessonLinks = () => {
  document.querySelectorAll('a[href="chess-lessons-abuja.html"]').forEach((link) => {
    const text = link.textContent.toLowerCase();
    if (text.includes("private")) link.href = "private-chess-lessons.html";
  });
};

const renderBankTransferSummaries = () => {
  const bankTransfer = getCoachingConfig()?.bankTransfer;
  if (!bankTransfer) return;

  document.querySelectorAll("[data-bank-transfer-summary]").forEach((summary) => {
    summary.innerHTML = `
      <div>
        <span>Lesson payment method</span>
        <strong>Bank transfer</strong>
      </div>
      <div>
        <p><b>${bankTransfer.bankName}</b> · ${bankTransfer.accountNumber}</p>
        <small>${bankTransfer.accountName}</small>
      </div>
      <small class="program-payment-reminder">Contact your coach and confirm the package before making payment.</small>
    `;
  });
};

const renderCoachProfiles = () => {
  const coachingConfig = getCoachingConfig();
  if (!coachingConfig) return;

  updatePrivateLessonLinks();
  renderBankTransferSummaries();

  document.querySelectorAll("[data-coach-profiles]").forEach((container) => {
    const offeringKey = container.dataset.coachProfiles;
    const coachId = container.dataset.coachId;
    const contactUrlOverride = container.dataset.contactUrl;
    const bankTransfer = coachingConfig.bankTransfer;
    const coaches = coachingConfig.coaches.filter((coach) => (
      coach.offerings?.[offeringKey] && (!coachId || coach.id === coachId)
    ));

    if (!bankTransfer || !coaches.length) return;

    container.innerHTML = "";
    container.setAttribute("aria-label", `Coaches offering ${offeringKey} lessons`);

    coaches.forEach((coach) => {
      const offering = coach.offerings[offeringKey];
      const profile = document.createElement("article");
      const profileTitleId = `${coach.id}-${offeringKey}-title`;
      const packages = offering.packages.map((item) => {
        const perSession = item.sessions > 1 ? Math.round(item.price / item.sessions) : null;
        const priceDetail = item.priceSuffix || (perSession
          ? `${formatNaira(perSession)} per lesson`
          : "Single coaching lesson");

        return `
          <article class="coach-package-card">
            <div>
              <span>${item.label}</span>
              <h4>${item.name}</h4>
            </div>
            <strong>${formatNaira(item.price)}</strong>
            <small>${priceDetail}</small>
            <p>${item.description}</p>
          </article>
        `;
      }).join("");

      profile.className = "coach-profile";
      profile.setAttribute("aria-labelledby", profileTitleId);
      profile.innerHTML = `
        <header class="coach-profile-header">
          <img src="${coach.photo}" alt="${coach.fullName}">
          <div>
            <span class="coach-title">${coach.title}</span>
            <h3 id="${profileTitleId}">${coach.name}</h3>
            <p>${coach.bio}</p>
          </div>
        </header>
        <section class="coach-offering" aria-label="${offering.name} packages for ${coach.name}">
          <div class="coach-offering-heading">
            <span>${offering.name}</span>
            <h4>${coach.name}'s lesson packages</h4>
            <p>These prices apply specifically to ${coach.name}.</p>
          </div>
          <div class="coach-package-grid">${packages}</div>
        </section>
        <footer class="coach-profile-footer">
          <section class="coach-bank-transfer" aria-labelledby="${coach.id}-${offeringKey}-transfer-title">
            <span class="payment-method-label">Bank transfer</span>
            <h4 id="${coach.id}-${offeringKey}-transfer-title">Pay after your booking is confirmed</h4>
            <dl class="bank-details">
              <div><dt>Account name</dt><dd>${bankTransfer.accountName}</dd></div>
              <div><dt>Account number</dt><dd><strong>${bankTransfer.accountNumber}</strong></dd></div>
              <div><dt>Bank</dt><dd>${bankTransfer.bankName}</dd></div>
            </dl>
            <button class="button secondary copy-account-number" type="button" data-account-number="${bankTransfer.accountNumber}">Copy account number</button>
            <p class="transfer-note">Use the learner's full name as the transfer narration, then send proof of payment to <a href="mailto:info@bruvschess.org">info@bruvschess.org</a>.</p>
            <p class="copy-status" role="status" aria-live="polite"></p>
          </section>
          <a class="button primary coach-contact-button" href="${contactUrlOverride || coach.contactUrl}">${coach.contactLabel}</a>
        </footer>
      `;

      container.append(profile);
    });
  });
};

const renderCoachingPrograms = () => {
  const coachingConfig = getCoachingConfig();
  if (!coachingConfig) return;

  document.querySelectorAll("[data-coaching-program]").forEach((container) => {
    const programKey = container.dataset.coachingProgram;
    const program = coachingConfig.programs?.[programKey];
    const bankTransfer = coachingConfig.bankTransfer;

    if (!program || !bankTransfer) return;

    const packages = program.packages.map((item) => {
      const perSession = item.sessions > 1 ? Math.round(item.price / item.sessions) : null;
      const priceDetail = item.priceSuffix || (perSession
        ? `${formatNaira(perSession)} per lesson`
        : "Single coaching lesson");

      return `
        <article class="coach-package-card">
          <div>
            <span>${item.label}</span>
            <h4>${item.name}</h4>
          </div>
          <strong>${formatNaira(item.price)}</strong>
          <small>${priceDetail}</small>
          <p>${item.description}</p>
        </article>
      `;
    }).join("");

    container.innerHTML = `
      <article class="coach-profile online-program-profile" aria-labelledby="${programKey}-title">
        <header class="online-program-header">
          <span class="coach-title">${program.name}</span>
          <h3 id="${programKey}-title">${program.title}</h3>
          <p>${program.description}</p>
        </header>
        <section class="coach-offering" aria-label="${program.name} packages">
          <div class="coach-offering-heading">
            <span>Flexible online coaching</span>
            <h4>Choose an online lesson package</h4>
            <p>Your instructor is assigned according to the learner's needs and availability.</p>
          </div>
          <div class="coach-package-grid">${packages}</div>
        </section>
        <footer class="coach-profile-footer">
          <section class="coach-bank-transfer" aria-labelledby="${programKey}-transfer-title">
            <span class="payment-method-label">Bank transfer</span>
            <h4 id="${programKey}-transfer-title">Pay after your booking is confirmed</h4>
            <dl class="bank-details">
              <div><dt>Account name</dt><dd>${bankTransfer.accountName}</dd></div>
              <div><dt>Account number</dt><dd><strong>${bankTransfer.accountNumber}</strong></dd></div>
              <div><dt>Bank</dt><dd>${bankTransfer.bankName}</dd></div>
            </dl>
            <button class="button secondary copy-account-number" type="button" data-account-number="${bankTransfer.accountNumber}">Copy account number</button>
            <p class="transfer-note">Use the learner's full name as the transfer narration, then send proof of payment to <a href="mailto:info@bruvschess.org">info@bruvschess.org</a>.</p>
            <p class="copy-status" role="status" aria-live="polite"></p>
          </section>
          <a class="button primary coach-contact-button" href="${program.contactUrl}">${program.contactLabel}</a>
        </footer>
      </article>
    `;
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
  if (getCoachingConfig()) {
    loadPaymentStyles();
    renderCoachProfiles();
    renderCoachingPrograms();
    return;
  }

  const script = document.createElement("script");
  script.src = "payment-config.js?v=coach-profiles";
  script.onload = () => {
    loadPaymentStyles();
    renderCoachProfiles();
    renderCoachingPrograms();
  };
  document.head.append(script);
};

loadPaymentConfig();
updatePrivateLessonLinks();
