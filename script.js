/* =========================================================
   PORTFÓLIO — Interações
   ========================================================= */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. Tema (claro/escuro) com preferência salva
  --------------------------------------------------------- */
  const themeToggle = doc.getElementById("theme-toggle");
  const THEME_KEY = "portfolio-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      /* modo privado: ignora */
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Alternar para o tema claro" : "Alternar para o tema escuro"
      );
    }
    storeTheme(theme);
  }

  // Tema inicial: preferência salva > preferência do sistema
  const stored = getStoredTheme();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (systemDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------------------------------------------------------
     2. Menu mobile
  --------------------------------------------------------- */
  const menuToggle = doc.getElementById("menu-toggle");
  const nav = doc.getElementById("nav-principal");

  function setMenu(open) {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    nav.classList.toggle("is-open", open);
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    // Fecha ao clicar em um link
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    // Fecha com a tecla Esc
    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });

    // Fecha ao voltar para o layout desktop
    window.matchMedia("(min-width: 781px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     3. Sombra do cabeçalho ao rolar
  --------------------------------------------------------- */
  const header = doc.querySelector(".site-header");
  let ticking = false;

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateHeader();

  /* ---------------------------------------------------------
     4. Animações de entrada (reveal)
  --------------------------------------------------------- */
  const revealItems = doc.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------
     5. Link ativo na navegação conforme a seção visível
  --------------------------------------------------------- */
  const navLinks = Array.from(doc.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (link) {
      return doc.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     6. Relógio local no hero
  --------------------------------------------------------- */
  const timeEl = doc.getElementById("local-time");

  function updateTime() {
    if (!timeEl) return;
    timeEl.textContent = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }

  if (timeEl) {
    updateTime();
    window.setInterval(updateTime, 30000);
  }

  /* ---------------------------------------------------------
     7. Rodapé: ano atual
  --------------------------------------------------------- */
  const yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     8. Copiar e-mail
  --------------------------------------------------------- */
  const copyBtn = doc.getElementById("copy-email");

  if (copyBtn) {
    const label = copyBtn.querySelector(".copy-email-label");
    const email = copyBtn.dataset.email || "";
    let resetTimer = null;

    copyBtn.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add("is-copied");
        if (label) label.textContent = "Copiado!";
      } catch (_) {
        // Fallback para navegadores sem Clipboard API
        const input = doc.createElement("input");
        input.value = email;
        doc.body.appendChild(input);
        input.select();
        try {
          doc.execCommand("copy");
          copyBtn.classList.add("is-copied");
          if (label) label.textContent = "Copiado!";
        } catch (err) {
          if (label) label.textContent = email;
        }
        doc.body.removeChild(input);
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        copyBtn.classList.remove("is-copied");
        if (label) label.textContent = "Copiar";
      }, 2200);
    });
  }

  /* ---------------------------------------------------------
     9. Validação do formulário de contato
  --------------------------------------------------------- */
  const form = doc.getElementById("contact-form");
  const status = doc.getElementById("form-status");

  const validators = {
    nome: function (value) {
      if (!value.trim()) return "Por favor, informe seu nome.";
      if (value.trim().length < 2) return "O nome precisa de ao menos 2 caracteres.";
      return "";
    },
    email: function (value) {
      if (!value.trim()) return "Por favor, informe seu e-mail.";
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!pattern.test(value.trim())) return "Informe um e-mail válido, como nome@exemplo.com.";
      return "";
    },
    mensagem: function (value) {
      if (!value.trim()) return "Escreva uma mensagem antes de enviar.";
      if (value.trim().length < 10) return "A mensagem precisa de ao menos 10 caracteres.";
      return "";
    },
  };

  function validateField(field) {
    const validator = validators[field.id];
    if (!validator) return true;

    const message = validator(field.value);
    const errorEl = doc.getElementById("erro-" + field.id);

    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (errorEl) errorEl.textContent = message;

    return !message;
  }

  if (form) {
    const fields = Array.from(form.querySelectorAll(".field input, .field textarea"));

    // Valida ao sair do campo (touched) e limpa o erro ao digitar
    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
    const accessKeyInput = doc.getElementById("access-key");
    const submitBtn = doc.getElementById("submit-btn");
    const submitLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;

    function clearFieldErrors() {
      fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
        const errorEl = doc.getElementById("erro-" + field.id);
        if (errorEl) errorEl.textContent = "";
      });
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const results = fields.map(validateField);
      const firstInvalidIndex = results.indexOf(false);

      if (firstInvalidIndex !== -1) {
        if (status) status.textContent = "Revise os campos destacados.";
        fields[firstInvalidIndex].focus();
        return;
      }

      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : "";
      if (!accessKey || accessKey === "COLE_AQUI_A_SUA_ACCESS_KEY") {
        if (status) {
          status.textContent =
            "O formulário ainda não está configurado (falta a access key do Web3Forms).";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "Enviando…";
      if (status) status.textContent = "";

      try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          if (status) {
            status.textContent =
              "Mensagem enviada com sucesso! Respondo em até 24 horas. Obrigado.";
          }
          form.reset();
          clearFieldErrors();
        } else {
          throw new Error((data && data.message) || "Erro no envio");
        }
      } catch (error) {
        if (status) {
          status.textContent =
            "Não foi possível enviar agora. Tente novamente ou escreva para arturxandeldomingos@gmail.com.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = "Enviar mensagem";
      }
    });
  }
})();
