/* HydroRegen site behaviour. No dependencies. */
(function () {
  "use strict";

  /* Partner form destination.
     Option A: set FORM_ENDPOINT to a Formspree / Getform URL and submissions post there.
     Option B: leave it empty and the form opens the visitor's email app addressed to CONTACT_EMAIL. */
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "hello@hydroregen.com";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.remove("no-js");

  /* ---------- Mobile menu ---------- */
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector(".menu-btn");
  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Rolling button text ---------- */
  document.querySelectorAll(".btn[data-roll]").forEach(function (btn) {
    var text = btn.textContent.trim();
    btn.setAttribute("aria-label", btn.getAttribute("aria-label") || text);
    var roll = document.createElement("span");
    roll.className = "roll";
    roll.setAttribute("aria-hidden", "true");
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.style.transitionDelay = i * 0.018 + "s";
      roll.appendChild(s);
    });
    btn.textContent = "";
    btn.appendChild(roll);
  });

  /* ---------- Badge shimmer text ---------- */
  document.querySelectorAll(".badge .t").forEach(function (t) {
    t.setAttribute("data-text", t.textContent);
  });

  /* ---------- Reveal + counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    var prefix = el.getAttribute("data-prefix") || "";
    var useComma = el.hasAttribute("data-comma");
    var fmt = function (n) {
      var s = n.toFixed(decimals);
      if (useComma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return prefix + s;
    };
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add("in");
      if (el.hasAttribute("data-count")) countUp(el);
      if (el.classList.contains("bars")) growBars(el);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;

  document.querySelectorAll(".reveal, [data-count], .bars").forEach(function (el) {
    if (io) io.observe(el);
    else { el.classList.add("in"); if (el.hasAttribute("data-count")) countUp(el); }
  });

  function growBars(wrap) {
    wrap.querySelectorAll("div").forEach(function (b, i) {
      var h = b.getAttribute("data-h");
      if (reduce) { b.style.height = h + "%"; return; }
      b.style.height = "0%";
      b.style.transition = "height .8s cubic-bezier(.2,.7,.2,1) " + i * 0.05 + "s";
      requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.height = h + "%"; }); });
    });
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-item button").forEach(function (b) {
    b.addEventListener("click", function () {
      var item = b.closest(".faq-item");
      var open = item.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Floating chip hides near footer ---------- */
  var floatCta = document.querySelector(".float-cta");
  var footer = document.querySelector(".footer");
  if (floatCta && footer && io) {
    new IntersectionObserver(function (en) {
      floatCta.classList.toggle("hide", en[0].isIntersecting);
    }).observe(footer);
  }

  /* ---------- Hero canvas: radiating line fan + glow ---------- */
  document.querySelectorAll("canvas[data-fan]").forEach(function (cv) {
    var ctx = cv.getContext("2d");
    var w, h, dpr, t0 = performance.now(), raf;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h + h * 0.02;
      var n = w < 600 ? 90 : 160;
      var len = Math.hypot(w, h) * 1.1;
      for (var i = 0; i <= n; i++) {
        var a = Math.PI + (i / n) * Math.PI;
        var x2 = cx + Math.cos(a) * len, y2 = cy + Math.sin(a) * len;
        var centre = 1 - Math.abs(i / n - 0.5) * 2; // 1 at middle
        var wave = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.35);
        var g = ctx.createLinearGradient(cx, cy, x2, y2);
        var base = 0.05 + 0.05 * wave;
        g.addColorStop(0, "rgba(0,230,168," + (0.08 + centre * 0.55 * (0.6 + 0.4 * wave)) + ")");
        g.addColorStop(0.18, "rgba(34,181,115," + (centre * 0.12) + ")");
        g.addColorStop(0.45, "rgba(255,255,255," + base * 0.6 + ")");
        g.addColorStop(1, "rgba(255,255,255," + base * 1.2 + ")");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      // bottom glow
      var rg = ctx.createRadialGradient(cx, h, 0, cx, h, Math.min(w, 900) * 0.45);
      rg.addColorStop(0, "rgba(0,230,168,0.35)");
      rg.addColorStop(0.4, "rgba(11,77,50,0.25)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    size();
    draw(performance.now());
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { cancelAnimationFrame(raf); size(); draw(performance.now()); }, 120);
    });
    // pause when off-screen
    if (io && !reduce) {
      new IntersectionObserver(function (en) {
        cancelAnimationFrame(raf);
        if (en[0].isIntersecting) raf = requestAnimationFrame(draw);
      }).observe(cv);
    }
  });

  /* ---------- Partner tracks + form ---------- */
  var form = document.getElementById("partner-form");
  if (form) {
    var trackSelect = form.querySelector("#track");
    var tracks = document.querySelectorAll(".track[data-track]");
    function setTrack(v) {
      tracks.forEach(function (tb) { tb.setAttribute("aria-pressed", String(tb.getAttribute("data-track") === v)); });
      if (trackSelect) trackSelect.value = v;
    }
    tracks.forEach(function (tb) {
      tb.addEventListener("click", function () {
        setTrack(tb.getAttribute("data-track"));
        form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
    if (trackSelect) trackSelect.addEventListener("change", function () { setTrack(trackSelect.value); });
    var q = new URLSearchParams(window.location.search).get("track");
    if (q && trackSelect && trackSelect.querySelector('option[value="' + q + '"]')) setTrack(q);

    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      if (data.get("_gotcha")) return;
      var name = data.get("name"), org = data.get("organisation"), track = data.get("track"), msg = data.get("message");
      var trackLabel = trackSelect.options[trackSelect.selectedIndex].text;

      if (FORM_ENDPOINT) {
        status.textContent = "Sending…";
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset(); setTrack("");
            status.textContent = "Thank you. We will reply within 2 working days.";
          })
          .catch(function () { status.textContent = "Could not send. Please email " + CONTACT_EMAIL + "."; });
        return;
      }
      var subject = "HydroRegen partnership: " + trackLabel + " (" + org + ")";
      var body = "Name: " + name + "\nOrganisation: " + org + "\nTrack: " + trackLabel + "\n\n" + msg;
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Opening your email app. If nothing happens, email " + CONTACT_EMAIL + ".";
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
