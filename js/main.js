/* Velo Solutions — comportamento do site (JavaScript puro, sem dependências). */

const VELO_CONFIG = {
  companyName: "Velo Solutions",
  contactEmail: "",      // ex.: "contato@velosolutions.com.br" — vazio esconde os links de e-mail
  whatsappNumber: "",    // ex.: "5522999999999" — vazio desativa os links de WhatsApp
  linkedinUrl: "",
  formEndpoint: "",      // ex.: endpoint do Formspree / Web3Forms que recebe o formulário
  webhookUrl: "",        // opcional: n8n / Make / Zapier
  analyticsId: "",       // opcional: só com isso preenchido o aviso de cookies aparece
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function track(eventName, data = {}) {
  if (!VELO_CONFIG.analyticsId) return;
  let consent = null;
  try { consent = localStorage.getItem("velo_cookie_consent"); } catch (e) { /* storage indisponível */ }
  if (consent !== "accepted") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
}

function waLink(message) {
  if (!VELO_CONFIG.whatsappNumber) return null;
  return "https://wa.me/" + VELO_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initNav();
  initReveal();
  initHeroCanvas();
  initConsole();
  initAudit();
  initFaq();
  initForm();
  initContactLinks();
  initCookies();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});

/* ---------------------------------------------------------------------- */
/* Header: fundo ao rolar e recolhimento ao descer                         */
/* ---------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const forceLight = document.body.classList.contains("header-light");
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", forceLight || y > 24);
    const navOpen = document.body.classList.contains("nav-open");
    header.classList.toggle("is-hidden", !navOpen && y > 480 && y > lastY + 4);
    if (y < lastY - 4 || y < 480) header.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };
  update();
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ---------------------------------------------------------------------- */
/* Menu mobile                                                             */
/* ---------------------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------------------------------------------------------------------- */
/* Revelação ao rolar, com escalonamento automático em grupos              */
/* ---------------------------------------------------------------------- */
function initReveal() {
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    group.querySelectorAll(":scope > [data-reveal]").forEach((el, i) => el.style.setProperty("--i", i));
  });
  const targets = document.querySelectorAll("[data-reveal], [data-observe]");
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.dispatchEvent(new CustomEvent("reveal"));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Hero: fluxos de dados em canvas (linhas e pulsos que convergem)        */
/* ---------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.querySelector(".hero-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, lanes = [], pulses = [], running = true, raf = null;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildLanes();
  };

  // Cada "lane" é uma curva que nasce à esquerda e converge para um ponto à direita
  const buildLanes = () => {
    const count = w < 700 ? 9 : 16;
    const tx = w * 0.78, ty = h * 0.46;
    lanes = Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const sy = h * (0.08 + t * 0.84);
      return { sx: -40, sy, c1x: w * 0.32, c1y: sy, c2x: w * 0.55, c2y: ty + (sy - ty) * 0.25, tx, ty };
    });
    pulses = [];
  };

  const point = (l, t) => {
    const u = 1 - t;
    return {
      x: u * u * u * l.sx + 3 * u * u * t * l.c1x + 3 * u * t * t * l.c2x + t * t * t * l.tx,
      y: u * u * u * l.sy + 3 * u * u * t * l.c1y + 3 * u * t * t * l.c2y + t * t * t * l.ty,
    };
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    lanes.forEach((l) => {
      ctx.beginPath();
      ctx.moveTo(l.sx, l.sy);
      ctx.bezierCurveTo(l.c1x, l.c1y, l.c2x, l.c2y, l.tx, l.ty);
      ctx.strokeStyle = "rgba(126, 162, 255, 0.09)";
      ctx.stroke();
    });
    if (!prefersReducedMotion && Math.random() < 0.09 && pulses.length < 26) {
      pulses.push({ lane: lanes[Math.floor(Math.random() * lanes.length)], t: 0, speed: 0.0028 + Math.random() * 0.0035, warn: Math.random() < 0.08 });
    }
    pulses = pulses.filter((p) => p.t <= 1);
    pulses.forEach((p) => {
      p.t += p.speed;
      const head = point(p.lane, Math.min(p.t, 1));
      const tail = point(p.lane, Math.max(p.t - 0.08, 0));
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      const color = p.warn ? "242, 193, 78" : "126, 162, 255";
      grad.addColorStop(0, `rgba(${color}, 0)`);
      grad.addColorStop(1, `rgba(${color}, 0.85)`);
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        const pt = point(p.lane, Math.max(p.t - 0.08, 0) + (Math.min(p.t, 1) - Math.max(p.t - 0.08, 0)) * (s / steps));
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color}, 0.95)`;
      ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
    if (running && !prefersReducedMotion) raf = requestAnimationFrame(draw);
  };

  resize();
  draw();
  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); if (prefersReducedMotion) draw(); }, 150); });

  // Pausa quando o hero sai da tela ou a aba fica oculta
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && !running) { running = true; raf = requestAnimationFrame(draw); }
      if (!visible) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }
}

/* ---------------------------------------------------------------------- */
/* Hero: console de conciliação bancária em execução                       */
/* ---------------------------------------------------------------------- */
function initConsole() {
  const consoleEl = document.querySelector("[data-console]");
  if (!consoleEl) return;
  const rows = Array.from(consoleEl.querySelectorAll(".console-row"));
  const matchedEl = consoleEl.querySelector("[data-stat='matched']");
  const flaggedEl = consoleEl.querySelector("[data-stat='flagged']");
  const timeEl = consoleEl.querySelector("[data-stat='time']");
  const bar = consoleEl.querySelector(".console-progress > i");
  const baseMatched = 1284;

  const setStatus = (row, kind) => {
    const s = row.querySelector(".status");
    s.className = "status status--" + kind;
    s.textContent = kind === "ok" ? "Conciliado" : kind === "warn" ? "Revisão humana" : "Na fila";
  };

  if (prefersReducedMotion) {
    rows.forEach((r) => setStatus(r, r.dataset.result === "warn" ? "warn" : "ok"));
    if (bar) bar.style.width = "100%";
    return;
  }

  let cycle = 0;
  const run = () => {
    rows.forEach((r) => setStatus(r, "pending"));
    if (bar) bar.style.width = "0%";
    let matched = baseMatched + cycle * rows.length, flagged = 0;
    rows.forEach((row, i) => {
      setTimeout(() => {
        row.classList.remove("is-scanning");
        void row.offsetWidth;
        row.classList.add("is-scanning");
        setTimeout(() => {
          const warn = row.dataset.result === "warn";
          setStatus(row, warn ? "warn" : "ok");
          warn ? flagged++ : matched++;
          if (matchedEl) matchedEl.textContent = matched.toLocaleString("pt-BR");
          if (flaggedEl) flaggedEl.textContent = String(flagged);
          if (timeEl) timeEl.textContent = (1.2 + i * 0.4).toFixed(1).replace(".", ",") + " s";
          if (bar) bar.style.width = ((i + 1) / rows.length) * 100 + "%";
        }, 650);
      }, 900 + i * 950);
    });
    cycle++;
    setTimeout(run, 900 + rows.length * 950 + 3200);
  };
  run();
}

/* ---------------------------------------------------------------------- */
/* Trilha de auditoria: linhas aparecem quando o bloco entra na tela       */
/* ---------------------------------------------------------------------- */
function initAudit() {
  const audit = document.querySelector("[data-audit]");
  if (!audit) return;
  const lines = audit.querySelectorAll(".audit-line");
  const play = () => lines.forEach((line, i) => setTimeout(() => line.classList.add("is-in"), prefersReducedMotion ? 0 : i * 420));
  if (audit.classList.contains("is-visible")) play();
  else audit.addEventListener("reveal", play, { once: true });
}

/* ---------------------------------------------------------------------- */
/* FAQ                                                                     */
/* ---------------------------------------------------------------------- */
function initFaq() {
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = !item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item.is-open").forEach((o) => {
        o.classList.remove("is-open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (open) track("faq_open", { question: btn.textContent.trim() });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Formulário de diagnóstico                                               */
/* ---------------------------------------------------------------------- */
function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const startedAt = Date.now();
  const success = document.getElementById("form-success");
  const fallback = document.getElementById("form-fallback");
  const submitBtn = form.querySelector("[type='submit']");
  const clean = (v) => String(v || "").replace(/[<>]/g, "").trim();

  const setError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`);
    const wrap = field && field.closest(".field, .check");
    const err = document.getElementById(`err-${name}`);
    if (err) err.textContent = msg || "";
    if (wrap) wrap.classList.toggle("has-error", Boolean(msg));
    if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const validate = () => {
    const errors = {};
    const v = (n) => clean(form.elements[n] && form.elements[n].value);
    if (!v("nome")) errors.nome = "Informe seu nome.";
    if (!v("empresa")) errors.empresa = "Informe o nome da empresa.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))) errors.email = "Informe um e-mail válido.";
    if (v("telefone").replace(/\D/g, "").length < 10) errors.telefone = "Informe um telefone com DDD.";
    if (!form.elements.consent.checked) errors.consent = "É necessário concordar com a Política de Privacidade.";
    ["nome", "empresa", "email", "telefone", "consent"].forEach((n) => setError(n, errors[n]));
    return errors;
  };

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("blur", () => { if (el.getAttribute("aria-invalid") === "true") validate(); });
  });

  const show = (el) => {
    form.hidden = true;
    if (el) { el.hidden = false; el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" }); }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.elements.hp_check && form.elements.hp_check.value) return; // bot
    const errors = validate();
    const first = Object.keys(errors)[0];
    if (first) { form.elements[first].focus(); return; }
    if (Date.now() - startedAt < 2500) return;

    const data = new FormData(form);
    data.delete("hp_check");
    data.append("origem", "site_contato");
    track("submit_contact_form");

    if (VELO_CONFIG.webhookUrl) fetch(VELO_CONFIG.webhookUrl, { method: "POST", body: data }).catch(() => {});

    if (VELO_CONFIG.formEndpoint) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
      fetch(VELO_CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then((r) => { if (!r.ok) throw new Error(r.status); show(success); })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Solicitar diagnóstico";
          setError("consent", "Não foi possível enviar agora. Tente novamente em instantes.");
        });
      return;
    }

    // Sem endpoint configurado: encaminha pelo WhatsApp ou e-mail, se existirem.
    const resumo = `Olá, Velo Solutions. Sou ${clean(data.get("nome"))}, da ${clean(data.get("empresa"))}. ` +
      `Gostaria de um diagnóstico${data.get("interesse") ? " sobre " + clean(data.get("interesse")) : ""}. ` +
      `Contato: ${clean(data.get("email"))} / ${clean(data.get("telefone"))}.` +
      (clean(data.get("mensagem")) ? ` Detalhes: ${clean(data.get("mensagem"))}` : "");
    const wa = waLink(resumo);
    const action = fallback && fallback.querySelector("[data-fallback-action]");
    if (action && wa) { action.href = wa; action.hidden = false; action.textContent = "Enviar pelo WhatsApp"; }
    else if (action && VELO_CONFIG.contactEmail) {
      action.href = `mailto:${VELO_CONFIG.contactEmail}?subject=${encodeURIComponent("Diagnóstico — " + clean(data.get("empresa")))}&body=${encodeURIComponent(resumo)}`;
      action.hidden = false; action.textContent = "Enviar por e-mail";
    }
    show(fallback);
  });
}

/* Links de e-mail / WhatsApp só aparecem quando configurados */
function initContactLinks() {
  const hide = (el) => { const li = el.closest("li"); (li || el).hidden = true; };
  document.querySelectorAll("[data-email]").forEach((el) => {
    if (!VELO_CONFIG.contactEmail) { hide(el); return; }
    el.href = "mailto:" + VELO_CONFIG.contactEmail;
    if (!el.dataset.keepText) el.textContent = VELO_CONFIG.contactEmail;
  });
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const link = waLink(el.dataset.wa || "Olá, Velo Solutions. Gostaria de conversar sobre automação de processos.");
    if (!link) { hide(el); return; }
    el.href = link; el.target = "_blank"; el.rel = "noopener";
  });
  document.querySelectorAll("[data-linkedin]").forEach((el) => {
    if (!VELO_CONFIG.linkedinUrl) { hide(el); return; }
    el.href = VELO_CONFIG.linkedinUrl; el.target = "_blank"; el.rel = "noopener";
  });
}

/* ---------------------------------------------------------------------- */
/* Aviso de cookies (só existe se houver ferramenta de análise)           */
/* ---------------------------------------------------------------------- */
function initCookies() {
  if (!VELO_CONFIG.analyticsId) return;
  let stored = null;
  try { stored = localStorage.getItem("velo_cookie_consent"); } catch (e) { return; }
  if (stored) return;
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Aviso de cookies");
  banner.innerHTML =
    '<p><strong>Privacidade e cookies.</strong> Usamos cookies de análise para entender como o site é utilizado. ' +
    'Saiba mais na <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
    '<div class="cookie-actions"><button class="btn btn-primary" data-c="accepted">Aceitar</button>' +
    '<button class="btn btn-secondary" data-c="essential_only">Apenas essenciais</button></div>';
  banner.addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    try { localStorage.setItem("velo_cookie_consent", b.dataset.c); } catch (err) { /* ignora */ }
    banner.remove();
  });
  document.body.appendChild(banner);
}
