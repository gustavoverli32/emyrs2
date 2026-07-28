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

// Global event tracking helper
function track(eventName, data = {}) {
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

  // Testimonials Carousel Logic (Internal Track Scroll Only)
  const carouselTrack = document.querySelector(".carousel-track");
  const dotsContainer = document.querySelector(".carousel-dots");
  if (carouselTrack && dotsContainer) {
    const slides = carouselTrack.querySelectorAll(".carousel-slide");
    dotsContainer.innerHTML = "";

    const scrollToSlide = (idx) => {
      const targetSlide = slides[idx];
      if (!targetSlide) return;
      const trackRect = carouselTrack.getBoundingClientRect();
      const slideRect = targetSlide.getBoundingClientRect();
      const targetLeft = carouselTrack.scrollLeft + (slideRect.left - trackRect.left);
      carouselTrack.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Depoimento ${idx + 1}`);
      dot.addEventListener("click", () => scrollToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const updateActiveDot = () => {
      const trackRect = carouselTrack.getBoundingClientRect();
      slides.forEach((slide, idx) => {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const trackCenter = trackRect.left + trackRect.width / 2;
        if (Math.abs(slideCenter - trackCenter) < slideRect.width / 2) {
          dotsContainer.querySelectorAll(".dot").forEach((d, dIdx) => {
            d.classList.toggle("active", dIdx === idx);
          });
        }
      });
    };

    carouselTrack.addEventListener("scroll", () => requestAnimationFrame(updateActiveDot), { passive: true });

    // Autoplay (Internal horizontal scroll ONLY)
    let autoplayTimer = setInterval(() => {
      const dots = Array.from(dotsContainer.querySelectorAll(".dot"));
      const currentIdx = dots.findIndex((d) => d.classList.contains("active"));
      const nextIdx = (currentIdx + 1) % slides.length;
      scrollToSlide(nextIdx);
    }, 6000);

    carouselTrack.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    carouselTrack.addEventListener("touchstart", () => clearInterval(autoplayTimer), { passive: true });
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

  // Business Segment Tabs (Platform section)
  const tabs = document.querySelectorAll("[data-biz-tab]");
  const panels = document.querySelectorAll("[data-biz-panel]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-pressed", "false"));
      tab.setAttribute("aria-pressed", "true");
      const key = tab.dataset.bizTab;
      panels.forEach((p) => {
        p.style.display = p.dataset.bizPanel === key ? "grid" : "none";
      });
    });
  });

  // AI Executive Agent Tabs Handler
  const agentTabs = document.querySelectorAll("[data-agent-tab]");
  const agentPanels = document.querySelectorAll("[data-agent-panel]");
  agentTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      agentTabs.forEach((t) => {
        t.setAttribute("aria-pressed", "false");
        t.classList.remove("active");
      });
      tab.setAttribute("aria-pressed", "true");
      tab.classList.add("active");
      const key = tab.dataset.agentTab;
      agentPanels.forEach((p) => {
        p.style.display = p.dataset.agentPanel === key ? "grid" : "none";
      });
      track("switch_agent_tab", { agent: key });
    });
  });

  // Contact Form with Honeypot, Rate Limit & Fallback
  const form = document.querySelector("#contact-form");
  if (form) {
    const successBox = document.querySelector("#form-success");
    const fallbackNotice = document.querySelector("#form-fallback-notice");

    // Input sanitization helper
    const sanitize = (str) => str.replace(/[<>]/g, "");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Check Honeypot field
      const hp = form.querySelector('input[name="hp_check"]');
      if (hp && hp.value) {
        // Silent block bot
        return;
      }

      // Check minimum completion time (< 3s bot flag)
      if (Date.now() - formSubmitTimeStart < 3000) {
        return;
      }

      // Check client-side rate limit (30s cooldown)
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

      // Save submission timestamp
      localStorage.setItem("emrys_last_submit", Date.now().toString());
      track("submit_form_contato", { empresa, email });

      // Secondary Webhook dispatch if configured
      if (EMRYS_CONFIG.webhookUrl) {
        fetch(EMRYS_CONFIG.webhookUrl, { method: "POST", body: formData }).catch(() => {});
      }

      // Main Form Endpoint submission
      if (EMRYS_CONFIG.formEndpoint) {
        fetch(EMRYS_CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        })
          .then(() => showSuccess())
          .catch(() => showError("nome", "Não foi possível enviar agora. Tente novamente ou use o WhatsApp."));
      } else {
        // No endpoint configured yet: show clear alternative options instead of false success
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
});
