/* main.js — bootstrapping */

(function () {
  "use strict";

  var config = window.__CONFIG;

  if (!config || !config.username) {
    document.body.innerHTML =
      '<div style="color:#ff5f56;padding:32px;font-family:monospace;">' +
      "<strong>config.js not loaded or invalid.</strong><br>" +
      "Make sure js/config.js exists and is loaded before js/main.js in index.html.</div>";
    return;
  }

  document.title = config.siteTitle || config.username + "@github ~ interactive terminal";

  var descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute("content", config.metaDescription || "");
  }

  var bannerEl = document.getElementById("bannerArt");
  if (bannerEl) {
    bannerEl.textContent = config.banner || "";
  }

  var taglineEl = document.querySelector(".tagline");
  if (taglineEl && config.tagline) {
    taglineEl.textContent = config.tagline;
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
        link.label +
        "</a>";
      if (i < keys.length - 1) html += "·";
    });
    footerLinks.innerHTML = html;
  }

  var footerTagline = document.querySelector("footer .tagline-text");
  if (footerTagline) {
    footerTagline.textContent = config.footer ? config.footer.tagline || "" : "";
  }

  window.__Terminal.init(
    document.getElementById("term"),
    document.getElementById("cmdInput"),
    document.getElementById("tooltip"),
    config,
    window.__Heatmap
  );
})();
