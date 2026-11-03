(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const dropBtn = document.querySelector(".nav-drop-btn");
  const dropItem = document.querySelector(".has-dropdown");
  const navLinks = document.querySelectorAll(".mobile-menu a");
  const sections = document.querySelectorAll("main section[id], .cta[id]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function currentFile() {
    const file = window.location.pathname.split("/").pop();
    return file && file.length ? file : "index.html";
  }

  function isSamePagePath(path) {
    if (!path) return true;
    const current = currentFile();
    if (path === current) return true;
    return path === "index.html" && (current === "" || current === "index.html");
  }

  (function initLoader() {
    const loader = document.getElementById("site-loader");
    if (!loader) {
      document.body.classList.remove("is-loading");
      return;
    }

    let hidden = false;
    function hideLoader() {
      if (hidden) return;
      hidden = true;
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }

    if (new URLSearchParams(window.location.search).has("loader")) {
      loader.addEventListener("click", hideLoader, { once: true });
      return;
    }

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }
    window.setTimeout(hideLoader, 8000);
  })();

  function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function lockBody() {
    if (document.body.dataset.scrollLock) return;
    const y = window.scrollY;
    document.body.dataset.scrollLock = "1";
    document.body.dataset.scrollY = String(y);
    document.body.style.position = "fixed";
    document.body.style.top = "-" + y + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
  }

  function unlockBody() {
    if (!document.body.dataset.scrollLock) return;
    const y = parseInt(document.body.dataset.scrollY || "0", 10);
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    delete document.body.dataset.scrollLock;
    delete document.body.dataset.scrollY;
    window.scrollTo(0, y);
  }

  function closeMobile() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = true;
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    if (header) header.classList.remove("is-menu-open");
    unlockBody();
  }

  function toggleMobile() {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (header) header.classList.toggle("is-menu-open", open);
    if (open) lockBody();
    else unlockBody();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", toggleMobile);
  }

  if (dropBtn && dropItem) {
    dropBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const expanded = dropBtn.getAttribute("aria-expanded") === "true";
      dropBtn.setAttribute("aria-expanded", String(!expanded));
      dropItem.classList.toggle("open", !expanded);
    });

    document.addEventListener("click", function (event) {
      if (!dropItem.contains(event.target)) {
        dropItem.classList.remove("open");
        dropBtn.setAttribute("aria-expanded", "false");
      }
    });

    dropBtn.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        dropItem.classList.remove("open");
        dropBtn.setAttribute("aria-expanded", "false");
        dropBtn.focus();
      }
    });
  }

  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const path = href.slice(0, hashIndex);
      const id = href.slice(hashIndex);
      if (!id || id === "#") return;
      if (!isSamePagePath(path)) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const offset = header ? header.offsetHeight + 28 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMobile();
    });
  });

  function setActiveNav() {
    if (document.body.dataset.page === "spices" || document.body.dataset.page === "pulses") {
      document.querySelectorAll(".nav-list > li > .nav-link").forEach(function (link) {
        link.classList.toggle("is-active", link.classList.contains("nav-drop-btn"));
      });
      return;
    }

    const fromTop = window.scrollY + (header ? header.offsetHeight + 40 : 80);
    let current = "home";

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top + window.scrollY <= fromTop) {
        current = section.id;
      }
    });

    const map = {
      home: "home",
      about: "about",
      products: "products",
      spices: "products",
      pulses: "products",
      why: "why",
      markets: "markets",
      quote: "contact",
      contact: "contact"
    };

    const key = map[current] || current;

    document.querySelectorAll(".nav-list > li > .nav-link").forEach(function (link) {
      const href = (link.getAttribute("href") || "").replace(/^.*#/, "").replace(/^.*\//, "");
      const linkHash = (link.getAttribute("href") || "").includes("#")
        ? (link.getAttribute("href") || "").split("#").pop()
        : "";
      const isProducts = link.classList.contains("nav-drop-btn") && (key === "products" || current === "spices" || current === "pulses");
      const active = linkHash === key || href === key || isProducts;
      link.classList.toggle("is-active", active);
    });
  }

  (function initAgriRail() {
    const rail = document.querySelector(".agri-rail");
    if (!rail) return;
    const scroller = rail.querySelector(".agri-rail-inner");
    const links = Array.prototype.slice.call(rail.querySelectorAll("a[href^='#']"));
    const targets = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (!targets.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        const on = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
        if (on && scroller) {
          const left = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
          scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
        }
      });
    }

    const railObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach(function (el) {
      railObserver.observe(el);
    });

    if (links[0]) setActive(links[0].getAttribute("href").slice(1));
  })();

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.querySelector("[data-count]")) {
            animateCounts(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
    observer.observe(el);
  });

  function animateCounts(scope) {
    if (reduceMotion) return;
    scope.querySelectorAll("[data-count]").forEach(function (el) {
      const end = Number(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      if (!end) return;
      const start = performance.now();
      const duration = 1100;

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMobile);
  });

  const shipSection = document.querySelector(".difference");
  const shipEl = document.getElementById("ship-track-vessel");
  const shipProgress = document.getElementById("ship-track-progress");
  const shipVerticalMq = window.matchMedia("(max-width: 1100px)");

  function getShipProgress() {
    const viewH = window.innerHeight;

    if (shipVerticalMq.matches) {
      const track = shipEl.parentElement;
      const rect = track.getBoundingClientRect();
      const marker = Math.min(viewH * 0.42, viewH - 140);
      return Math.max(0, Math.min(1, (marker - rect.top) / Math.max(rect.height, 1)));
    }

    const rect = shipSection.getBoundingClientRect();
    const travel = Math.max(shipSection.offsetHeight - viewH, 1);
    return Math.max(0, Math.min(1, -rect.top / travel));
  }

  function updateShipTrack() {
    if (!shipSection || !shipEl || !shipProgress) return;

    const vertical = shipVerticalMq.matches;
    const progress = reduceMotion ? 0.5 : getShipProgress();
    const start = 6;
    const span = 88;
    const pct = start + progress * span;

    if (vertical) {
      const trackH = shipEl.parentElement ? shipEl.parentElement.offsetHeight : 0;
      const y = trackH * (pct / 100);
      shipEl.style.left = "50%";
      shipEl.style.top = y + "px";
      shipEl.style.transform = "translate(-50%, -50%)";
      shipProgress.style.width = "100%";
      shipProgress.style.height = y + "px";
    } else {
      shipEl.style.top = "50%";
      shipEl.style.left = pct + "%";
      shipEl.style.transform = "translate(-50%, -58%)";
      shipProgress.style.height = "100%";
      shipProgress.style.width = pct + "%";
    }
  }

  window.addEventListener("scroll", function () {
    setHeaderState();
    setActiveNav();
    updateShipTrack();
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeMobile();
    updateShipTrack();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMobile();
  });

  setHeaderState();
  setActiveNav();
  updateShipTrack();

  initInquiryForm();
  initCtaParticles();

  function initInquiryForm() {
    const dialog = document.getElementById("inquiry");
    const form = document.getElementById("inquiry-form");
    if (!dialog || !form || typeof dialog.showModal !== "function") return;

    const panel = dialog.querySelector("[data-inquiry-panel]");
    const success = dialog.querySelector("[data-inquiry-success]");
    const fields = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      contact: form.elements.namedItem("contact"),
      message: form.elements.namedItem("message")
    };
    let lastFocus = null;
    let closeTimer = 0;

    function setError(key, message) {
      const input = fields[key];
      const wrap = input.closest(".inquiry-field");
      const error = document.getElementById("inquiry-" + key + "-error");
      if (!wrap || !error) return;
      if (message) {
        wrap.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", error.id);
        error.hidden = false;
        error.textContent = message;
      } else {
        wrap.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
        error.hidden = true;
        error.textContent = "";
      }
    }

    function clearErrors() {
      Object.keys(fields).forEach(function (key) {
        setError(key, "");
      });
    }

    function validateName(value) {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Name must be at least 2 characters.";
      if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(value)) return "Use letters only in your name.";
      return "";
    }

    function validateEmail(value) {
      if (!value) return "Please enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email address.";
      return "";
    }

    function validateContact(value) {
      if (!value) return "Please enter your contact number.";
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) return "Enter a valid phone number (7–15 digits).";
      if (!/^[+\d][\d\s().-]{6,19}$/.test(value)) return "Use numbers only, with optional + or spaces.";
      return "";
    }

    function validateMessage(value) {
      if (!value) return "Please enter your message.";
      if (value.length < 10) return "Message must be at least 10 characters.";
      return "";
    }

    function validateAll() {
      const values = {
        name: String(fields.name.value || "").trim(),
        email: String(fields.email.value || "").trim(),
        contact: String(fields.contact.value || "").trim(),
        message: String(fields.message.value || "").trim()
      };
      const errors = {
        name: validateName(values.name),
        email: validateEmail(values.email),
        contact: validateContact(values.contact),
        message: validateMessage(values.message)
      };
      Object.keys(errors).forEach(function (key) {
        setError(key, errors[key]);
      });
      const firstInvalid = Object.keys(errors).find(function (key) {
        return errors[key];
      });
      return { ok: !firstInvalid, firstInvalid: firstInvalid, values: values };
    }

    function showForm() {
      if (panel) panel.hidden = false;
      if (success) success.hidden = true;
    }

    function showSuccess() {
      if (panel) panel.hidden = true;
      if (success) success.hidden = false;
      const closeBtn = dialog.querySelector(".inquiry-success [data-close-inquiry]");
      if (closeBtn) closeBtn.focus();
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(closeInquiry, 1800);
    }

    function openInquiry() {
      lastFocus = document.activeElement;
      window.clearTimeout(closeTimer);
      showForm();
      clearErrors();
      if (!dialog.open) dialog.showModal();
      if (fields.name) fields.name.focus();
      closeMobile();
    }

    function closeInquiry() {
      window.clearTimeout(closeTimer);
      if (!dialog.open) return;
      dialog.close();
    }

    document.querySelectorAll("[data-open-inquiry]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openInquiry();
      });
    });

    dialog.querySelectorAll("[data-close-inquiry]").forEach(function (btn) {
      btn.addEventListener("click", closeInquiry);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeInquiry();
    });

    dialog.addEventListener("close", function () {
      window.clearTimeout(closeTimer);
      form.reset();
      clearErrors();
      showForm();
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    });

    Object.keys(fields).forEach(function (key) {
      const input = fields[key];
      if (!input) return;
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          const check = {
            name: validateName,
            email: validateEmail,
            contact: validateContact,
            message: validateMessage
          }[key];
          setError(key, check(String(input.value || "").trim()));
        }
      });
      input.addEventListener("blur", function () {
        const check = {
          name: validateName,
          email: validateEmail,
          contact: validateContact,
          message: validateMessage
        }[key];
        const value = String(input.value || "").trim();
        if (value || input.getAttribute("aria-invalid") === "true") {
          setError(key, check(value));
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const result = validateAll();
      if (!result.ok) {
        if (result.firstInvalid && fields[result.firstInvalid]) {
          fields[result.firstInvalid].focus();
        }
        return;
      }
      showSuccess();
    });
  }

  function initCtaParticles() {
    const canvas = document.getElementById("cta-particles");
    const section = document.querySelector(".cta");
    if (!canvas || !section || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = [];
    let width = 0;
    let height = 0;
    let running = false;
    let raf = 0;

    function resize() {
      const rect = section.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(28, Math.floor((width * height) / 18000));
      dots.length = 0;
      for (let i = 0; i < count; i += 1) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(217, 165, 46, 0.7)";
      ctx.strokeStyle = "rgba(217, 165, 46, 0.18)";

      for (let i = 0; i < dots.length; i += 1) {
        const a = dots[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j += 1) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.globalAlpha = 1 - dist / 110;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      if (running) raf = requestAnimationFrame(draw);
    }

    const vis = new IntersectionObserver(function (entries) {
      running = entries[0] && entries[0].isIntersecting;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.08 });

    vis.observe(section);
    window.addEventListener("resize", resize);
    resize();
  }
})();
