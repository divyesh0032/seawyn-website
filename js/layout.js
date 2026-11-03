(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "home";
  var backTargets = {
    home: "#home",
    spices: "#spices-top",
    pulses: "#pulses-top"
  };

  function currentFile() {
    var file = window.location.pathname.split("/").pop();
    return file && file.length ? file : "index.html";
  }

  function inject(name) {
    var host = document.querySelector('[data-layout="' + name + '"]');
    if (!host) return Promise.resolve();
    return fetch("partials/" + name + ".html", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("Could not load " + name);
        return response.text();
      })
      .then(function (html) {
        host.outerHTML = html.trim();
      });
  }

  function markActive() {
    document.querySelectorAll("[data-nav-product]").forEach(function (link) {
      var on = link.getAttribute("data-nav-product") === page;
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    var dropBtn = document.querySelector(".nav-drop-btn");
    document.querySelectorAll(".nav-list > li > .nav-link").forEach(function (link) {
      link.classList.remove("is-active");
    });

    if (page === "spices" || page === "pulses") {
      if (dropBtn) dropBtn.classList.add("is-active");
      return;
    }

    var homeLink = document.querySelector('[data-nav="home"]');
    if (homeLink) homeLink.classList.add("is-active");
  }

  function setBackToTop() {
    var link = document.querySelector("[data-back-top]");
    if (!link) return;
    link.setAttribute("href", backTargets[page] || "#home");
  }

  function loadScript() {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "js/script.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  Promise.all([inject("header"), inject("site-end"), inject("inquiry")])
    .then(function () {
      markActive();
      setBackToTop();
      return loadScript();
    })
    .catch(function (error) {
      console.error(error);
      document.body.classList.remove("is-loading");
      var loader = document.getElementById("site-loader");
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    });

  window.SeawynLayout = {
    page: page,
    currentFile: currentFile
  };
})();
