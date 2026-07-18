// Emrys — static site behavior. No build step, no framework.
const EMRYS_CONFIG = {
  companyName: "Emrys",
  whatsappNumber: "", // e.g. "5522999999999" — leave empty to disable wa.me links
  contactEmail: "contato@emrys.ai",
  instagramUrl: "",
  linkedinUrl: "",
  formEndpoint: "", // e.g. Formspree/Web3Forms endpoint URL
  analyticsId: "",
};

function waLink(message) {
  if (!EMRYS_CONFIG.whatsappNumber) return "#contato";
  return "https://wa.me/" + EMRYS_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
}

document.addEventListener("DOMContentLoaded", () => {
  // wire up whatsapp links
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    el.setAttribute("href", waLink(el.dataset.waLink || "Olá! Conheci a Emrys pelo site e gostaria de entender como uma plataforma personalizada pode ajudar minha empresa."));
    if (!EMRYS_CONFIG.whatsappNumber) el.setAttribute("aria-disabled", "true");
  });
  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = EMRYS_CONFIG.whatsappNumber || "[a confirmar]";
  });

  // whatsapp float button: hidden until hero is scrolled past
  const waFloat = document.querySelector(".wa-float");
  const hero = document.querySelector(".hero");
  if (waFloat && hero) {
    const toggleFloat = () => {
      const past = hero.getBoundingClientRect().bottom < 0;
      waFloat.classList.toggle("is-visible", past);
    };
    toggleFloat();
    window.addEventListener("scroll", toggleFloat, { passive: true });
  } else if (waFloat) {
    waFloat.classList.add("is-visible");
  }

  // mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navBackdrop = document.querySelector("#nav-backdrop");
  if (navToggle && navLinks) {
    const focusables = () => navLinks.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const openMenu = () => {
      navLinks.classList.add("open");
      navBackdrop && navBackdrop.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      const f = focusables();
      if (f.length) f[0].focus();
    };
    const closeMenu = ({ restoreFocus = true } = {}) => {
      navLinks.classList.remove("open");
      navBackdrop && navBackdrop.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (restoreFocus) navToggle.focus();
    };
    navToggle.addEventListener("click", () => {
      navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });
    navBackdrop && navBackdrop.addEventListener("click", () => closeMenu());
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") closeMenu({ restoreFocus: false });
    });
    document.addEventListener("keydown", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key === "Tab") {
        const f = Array.from(focusables());
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // dashboard counters
  const dashboard = document.querySelector("#dashboard");
  if (dashboard) {
    let animated = false;
    const animate = () => {
      if (animated) return;
      animated = true;
      dashboard.querySelectorAll("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        const start = performance.now();
        const duration = 1200;
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = prefix + val.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    if ("IntersectionObserver" in window) {
      const dio = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && animate()),
        { threshold: 0.3 }
      );
      dio.observe(dashboard);
    } else {
      animate();
    }
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // business segment tabs (platform section)
  const tabs = document.querySelectorAll("[data-biz-tab]");
  const panels = document.querySelectorAll("[data-biz-panel]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-pressed", "false"));
      tab.setAttribute("aria-pressed", "true");
      const key = tab.dataset.bizTab;
      panels.forEach((p) => {
        p.style.display = p.dataset.bizPanel === key ? "flex" : "none";
      });
    });
  });

  // contact form
  const form = document.querySelector("#contact-form");
  if (form) {
    const successBox = document.querySelector("#form-success");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
      const showError = (field, msg) => {
        valid = false;
        const err = form.querySelector('[data-error-for="' + field + '"]');
        if (err) err.textContent = msg;
      };
      const nome = form.nome.value.trim();
      const empresa = form.empresa.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
      const consent = form.consent.checked;
      if (!nome) showError("nome", "Informe seu nome.");
      if (!empresa) showError("empresa", "Informe o nome da empresa.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) showError("email", "Informe um e-mail válido.");
      if (!telefone) showError("telefone", "Informe um telefone.");
      if (!consent) showError("consent", "É necessário aceitar o uso dos dados.");
      if (!valid) return;

      if (EMRYS_CONFIG.formEndpoint) {
        fetch(EMRYS_CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        })
          .then(() => showSuccess())
          .catch(() => showError("nome", "Não foi possível enviar agora. Tente novamente."));
      } else {
        // No backend configured yet — set EMRYS_CONFIG.formEndpoint (Formspree/Web3Forms) in js/main.js
        showSuccess();
      }
      function showSuccess() {
        form.hidden = true;
        if (successBox) successBox.hidden = false;
      }
    });
  }
});
