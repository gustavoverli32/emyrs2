// Emrys — static site behavior. No build step, no framework.
const EMRYS_CONFIG = {
  companyName: "Emrys",
  whatsappNumber: "", // e.g. "5522999999999" — leave empty to disable wa.me links
  contactEmail: "contato@emrys.ai",
  instagramUrl: "",
  linkedinUrl: "",
  formEndpoint: "", // e.g. Formspree/Web3Forms endpoint URL
  analyticsId: "",
  webhookUrl: "",        // n8n / Make / Zapier — recebe o lead e distribui
  calendarUrl: "",       // Cal.com ou Google Calendar, alternativa ao formulário
  analyticsProvider: "", // "ga4" | "plausible" | ""
};

// Global event tracking helper (Respeita o consentimento LGPD)
function track(eventName, data = {}) {
  const consent = localStorage.getItem("emrys_cookie_consent");
  if (consent === "essential_only") return;
  if (!EMRYS_CONFIG.analyticsId && !window.dataLayer) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
}

function waLink(message) {
  if (!EMRYS_CONFIG.whatsappNumber) return "#contato";
  return "https://wa.me/" + EMRYS_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
}

document.addEventListener("DOMContentLoaded", () => {
  let formSubmitTimeStart = Date.now();

  // --- GSAP 3 & ScrollTrigger Animations (Estilo Framer / Sparo High-End) ---
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Entry Animation (Staggered fade-up with power3.out)
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.from(".hero .eyebrow", { y: 30, opacity: 0, duration: 0.8 })
          .from(".hero h1 .t-sans", { y: 40, opacity: 0, duration: 0.9 }, "-=0.6")
          .from(".hero h1 .t-serif", { y: 40, opacity: 0, duration: 0.9 }, "-=0.7")
          .from(".hero .lead", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".hero .hero-ctas", { y: 25, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".hero .hero-illustration", { scale: 0.92, opacity: 0, duration: 1 }, "-=0.8");

    // Continuous Floating Levitation for Hero Brain & Panel
    gsap.to(".hero-brain", {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero-panel", {
      y: -6,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });

    // ScrollTrigger Animations for Process Cards
    if (typeof ScrollTrigger !== "undefined") {
      gsap.from(".process-card", {
        scrollTrigger: {
          trigger: "#processo",
          start: "top 75%",
          toggleActions: "play none none none"
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out"
      });

      // ScrollTrigger Animations for Case Cards
      gsap.from(".case-card-box", {
        scrollTrigger: {
          trigger: "#cases",
          start: "top 75%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out"
      });
    }

    // Magnetic Button Effect on Hover
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
      });
    });
  }

  // Wire up whatsapp links & displays
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    const defaultMsg = "Olá! Conheci a Emrys pelo site e gostaria de entender como uma plataforma personalizada pode ajudar minha empresa.";
    el.setAttribute("href", waLink(el.dataset.waLink || defaultMsg));
    if (!EMRYS_CONFIG.whatsappNumber) {
      el.setAttribute("aria-disabled", "true");
    } else {
      el.addEventListener("click", () => track("click_whatsapp", { source: el.dataset.waSource || "generic" }));
    }
  });

  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = EMRYS_CONFIG.whatsappNumber || "[a confirmar]";
  });

  // WhatsApp float button visibility
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

  // Mobile nav toggle with focus trap & ESC handling
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navBackdrop = document.querySelector("#nav-backdrop");
  if (navToggle && navLinks) {
    const focusables = () => navLinks.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([-1])');
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

  // Scroll reveal with stagger for groups
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealGroups = document.querySelectorAll("[data-reveal-group]");

  if ("IntersectionObserver" in window) {
    const groupIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll("[data-reveal]");
          children.forEach((child, i) => {
            child.style.transitionDelay = (i * 80) + "ms";
            child.classList.add("is-visible");
          });
          groupIo.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });

    revealGroups.forEach((g) => groupIo.observe(g));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });

    revealEls.forEach((el) => {
      if (!el.closest("[data-reveal-group]")) {
        io.observe(el);
      }
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Generalized count-up observer for metrics & dashboard
  const countContainers = document.querySelectorAll("#dashboard, [data-count-group]");
  countContainers.forEach((container) => {
    let animated = false;
    const animate = () => {
      if (animated) return;
      animated = true;
      container.querySelectorAll("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        const start = performance.now();
        const duration = 1400;
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
        { threshold: 0.25 }
      );
      dio.observe(container);
    } else {
      animate();
    }
  });

  // Vertical Timeline Synchronized Line & Card Animation
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const lineFill = timeline.querySelector(".timeline-line-fill");
    const items = timeline.querySelectorAll(".timeline-item");

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerY = windowHeight * 0.6; // Trigger line at 60% of viewport height
      const timelineTop = rect.top;
      const timelineHeight = rect.height;

      const currentScroll = triggerY - timelineTop;
      let percentage = (currentScroll / timelineHeight) * 100;
      percentage = Math.min(100, Math.max(0, percentage));

      if (lineFill) {
        lineFill.style.height = percentage + "%";
        lineFill.classList.toggle("is-active", percentage > 0 && percentage < 100);
      }

      items.forEach((item) => {
        const dot = item.querySelector(".icon-circle, .timeline-dot");
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + (itemRect.height / 2);

        if (itemCenter <= triggerY + 40) {
          item.classList.add("is-active");
          if (dot) dot.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
          if (dot) dot.classList.remove("is-active");
        }
      });
    };

    window.addEventListener("scroll", () => requestAnimationFrame(updateTimeline), { passive: true });
    window.addEventListener("resize", () => requestAnimationFrame(updateTimeline), { passive: true });
    updateTimeline();
  }

  // FAQ Accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      const parent = item.parentElement;
      parent.querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        const q = o.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        track("open_faq_item", { question: btn.textContent.trim() });
      }
    });
  });

  // Contact Form with Honeypot, Rate Limit & Fallback
  const form = document.querySelector("#contact-form");
  if (form) {
    const successBox = document.querySelector("#form-success");
    const fallbackNotice = document.querySelector("#form-fallback-notice");

    const sanitize = (str) => str.replace(/[<>]/g, "");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const hp = form.querySelector('input[name="hp_check"]');
      if (hp && hp.value) return;

      if (Date.now() - formSubmitTimeStart < 3000) return;

      const lastSubmit = localStorage.getItem("emrys_last_submit");
      if (lastSubmit && Date.now() - parseInt(lastSubmit, 10) < 30000) {
        alert("Aguarde alguns segundos antes de enviar uma nova mensagem.");
        return;
      }

      let valid = true;
      form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
      const showError = (field, msg) => {
        valid = false;
        const err = form.querySelector('[data-error-for="' + field + '"]');
        if (err) err.textContent = msg;
      };

      const nome = sanitize(form.nome ? form.nome.value.trim() : "");
      const empresa = sanitize(form.empresa ? form.empresa.value.trim() : "");
      const email = sanitize(form.email ? form.email.value.trim() : "");
      const telefone = sanitize(form.telefone ? form.telefone.value.trim() : "");
      const consent = form.consent ? form.consent.checked : true;

      if (!nome) showError("nome", "Informe seu nome.");
      if (!empresa) showError("empresa", "Informe o nome da empresa.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) showError("email", "Informe um e-mail válido.");
      if (!telefone) showError("telefone", "Informe um telefone.");
      if (!consent) showError("consent", "É necessário aceitar os termos.");
      if (!valid) return;

      const formData = new FormData(form);
      formData.append("origem", "contato_principal");

      localStorage.setItem("emrys_last_submit", Date.now().toString());
      track("submit_form_contato", { empresa, email });

      if (EMRYS_CONFIG.webhookUrl) {
        fetch(EMRYS_CONFIG.webhookUrl, { method: "POST", body: formData }).catch(() => {});
      }

      if (EMRYS_CONFIG.formEndpoint) {
        fetch(EMRYS_CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        })
          .then(() => showSuccess())
          .catch(() => showError("nome", "Não foi possível enviar agora. Tente novamente ou use o WhatsApp."));
      } else {
        if (fallbackNotice) {
          form.hidden = true;
          fallbackNotice.hidden = false;
        } else {
          showSuccess();
        }
      }

      function showSuccess() {
        form.hidden = true;
        if (successBox) successBox.hidden = false;
      }
    });
  }

  // Footer Newsletter Mini Form
  const footerForm = document.querySelector("#footer-newsletter");
  if (footerForm) {
    footerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = footerForm.querySelector('input[type="email"]');
      if (!emailInput || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput.value.trim())) return;
      const data = new FormData();
      data.append("email", emailInput.value.trim());
      data.append("origem", "footer");
      if (EMRYS_CONFIG.formEndpoint) {
        fetch(EMRYS_CONFIG.formEndpoint, { method: "POST", body: data }).catch(() => {});
      }
      emailInput.value = "";
      alert("Obrigado pelo seu interesse! Entraremos em contato.");
    });
  }

  // Scroll Depth 75% tracking
  let tracked75 = false;
  window.addEventListener("scroll", () => {
    if (tracked75) return;
    const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (depth >= 0.75) {
      tracked75 = true;
      track("scroll_depth_75");
    }
  }, { passive: true });

  // Banner de Consentimento de Cookies LGPD
  const cookieConsent = localStorage.getItem("emrys_cookie_consent");
  if (!cookieConsent) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de Privacidade e Cookies");
    banner.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px;">
        <strong style="color:var(--text);font-size:15px;display:flex;align-items:center;gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01"/></svg>
          Privacidade e Cookies (LGPD)
        </strong>
        <p style="color:var(--text-dim);font-size:13px;line-height:1.5;margin:0;">
          Utilizamos cookies essenciais e análise de navegação para aprimorar sua experiência. Consulte nossa <a href="politica-de-privacidade.html" style="color:var(--accent);text-decoration:underline;">Política de Privacidade</a>.
        </p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;">
        <button id="btn-cookie-accept" class="btn btn-primary" style="padding:8px 16px;font-size:13px;flex:1;min-width:130px;">Aceitar Todos</button>
        <button id="btn-cookie-essential" class="btn" style="padding:8px 16px;font-size:13px;background:rgba(255,255,255,0.06);border:1px solid var(--border);color:var(--text-dim);flex:1;min-width:130px;">Apenas Essenciais</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("btn-cookie-accept")?.addEventListener("click", () => {
      localStorage.setItem("emrys_cookie_consent", "accepted");
      banner.remove();
      track("cookie_consent_accepted");
    });

    document.getElementById("btn-cookie-essential")?.addEventListener("click", () => {
      localStorage.setItem("emrys_cookie_consent", "essential_only");
      banner.remove();
    });
  }
});
