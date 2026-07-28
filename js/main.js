/* main.js — bootstrapping */

(function () {
  "use strict";

  var config = window.__CONFIG;

  function tc(str) {
    if (!config.i18n || !config.i18n.pt) return str;
    if (config.lang !== "pt") return str;
    return config.i18n.pt[str] || str;
  }

  if (!config || !config.username) {
    document.body.innerHTML =
      '<div style="color:#ff5f56;padding:32px;font-family:monospace;">' +
      "<strong>config.js not loaded or invalid.</strong><br>" +
      "Make sure js/config.js exists and is loaded before js/main.js in index.html.</div>";
    return;
  }

  document.title =
    tc(config.siteTitle) || config.username + "@github ~ interactive terminal";

  var descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute("content", tc(config.metaDescription) || "");
  }

  var bannerEl = document.getElementById("bannerArt");
  if (bannerEl) {
    bannerEl.textContent = config.banner || "";
  }

  var taglineEl = document.querySelector(".tagline");
  if (taglineEl && config.tagline) {
    taglineEl.textContent = tc(config.tagline);
  }

  var titleLabel = document.querySelector(".titlebar .label");
  if (titleLabel) {
    titleLabel.textContent = (config.username || "user") + "@github: ~";
  }

  var promptTag = document.querySelector(".inputRow .prompt-tag");
  if (promptTag) {
    promptTag.textContent = (config.username || "user") + "@github:~$";
  }

  var footerLinks = document.querySelector("footer .links");
  if (footerLinks && config.openLinks) {
    var html = "";
    var keys = Object.keys(config.openLinks);
    keys.forEach(function (key, i) {
      var link = config.openLinks[key];
      html +=
        '<a href="' +
        link.url +
        '" target="_blank" rel="noopener">' +
        tc(link.label) +
        "</a>";
      if (i < keys.length - 1) html += "·";
    });
    footerLinks.innerHTML = html;
  }

  var footerTagline = document.querySelector("footer .tagline-text");
  if (footerTagline) {
    footerTagline.textContent = config.footer
      ? tc(config.footer.tagline || "")
      : "";
  }

  /* rendered text in footer */
  var footerRendered = document.querySelector("footer div:last-child");
  if (footerRendered && config.footer && config.footer.rendered) {
    footerRendered.textContent = tc(config.footer.rendered);
  }

  window.__Terminal.init(
    document.getElementById("term"),
    document.getElementById("cmdInput"),
    document.getElementById("tooltip"),
    config,
    window.__Heatmap,
  );
})();
