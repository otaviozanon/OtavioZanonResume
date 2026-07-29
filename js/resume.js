/* resume.js — PDF resume builder */

window.__Resume = (function () {
  "use strict";

  var C = {
    navy: "#0f172a",
    blue: "#3b82f6",
    blueLt: "#60a5fa",
    bluePale: "#dbeafe",
    blueBg: "#f0f7ff",
    gray50: "#f8fafc",
    gray100: "#f1f5f9",
    gray200: "#e2e8f0",
    gray300: "#cbd5e1",
    gray400: "#94a3b8",
    gray500: "#64748b",
    gray600: "#475569",
    gray700: "#334155",
    gray800: "#1e293b",
    darkBg: "#1a2235",
    white: "#fff",
  };

  function build(config, esc, t) {
    var whoami = config.whoami || [];
    var experience = config.experience || [];
    var education = config.education || [];
    var certifications = config.certifications || [];
    var languages = config.languages || [];
    var skillCategories = config.skillCategories || [];
    var contact = config.contact || [];

    var name = whoami[0] || config.username;
    var tagline = t(whoami[2] || config.tagline);
    var location = t(whoami[1] || "");
    var summaryLines = whoami.slice(3);

    function pick(label) {
      var item = contact.filter(function (c) {
        return c[0] === label;
      })[0];
      return item ? item[2] : "";
    }
    var phone = pick("phone");
    var email = pick("email");

    function linkUrl(key) {
      return config.openLinks[key] ? config.openLinks[key].url : "#";
    }
    var gh = linkUrl("github");
    var li = linkUrl("linkedin");
    var web = linkUrl("portfolio");

    /* ---- section builders ---- */

    function buildExp() {
      return experience
        .map(function (exp) {
          return `
          <div class="exp-item">
            <div class="exp-head">
              <span class="exp-title">${esc(t(exp.role))}</span>
              <span class="exp-company">${esc(exp.company)}</span>
              <span class="exp-date">${esc(exp.period)}</span>
            </div>
            <p class="exp-desc">${esc(t(exp.summary))}</p>
            <p class="exp-tech">${esc(exp.tech)}</p>
          </div>`;
        })
        .join("");
    }

    function buildEdu() {
      return education
        .map(function (edu) {
          return `
          <div class="exp-item" style="margin-bottom:0;padding-bottom:0;border:0">
            <div class="exp-head">
              <span class="exp-title">${esc(t(edu.degree))}</span>
              <span class="exp-company">${esc(edu.institution)}</span>
              <span class="exp-date">${esc(edu.period)}</span>
            </div>
          </div>`;
        })
        .join("");
    }

    function buildCerts() {
      return certifications
        .map(function (cert) {
          return `
          <div class="cert-chip">
            ${esc(t(cert.name))}
            <span class="cert-year">${esc(cert.year)}</span>
          </div>`;
        })
        .join("");
    }

    function buildLangs() {
      return languages
        .map(function (lang) {
          return `
          <div class="lang-row">
            <span class="lang-name">${esc(t(lang.language))}</span>
            <span class="lang-level">${esc(t(lang.level))}</span>
          </div>`;
        })
        .join("");
    }

    function buildSkills() {
      return skillCategories
        .map(function (cat) {
          return `
          <div class="skill-row">
            <span class="skill-cat">${esc(t(cat.category))}</span>
            <span class="skill-items">${esc(cat.items)}</span>
          </div>`;
        })
        .join("");
    }

    function buildSummary() {
      return summaryLines
        .map(function (line) {
          return `<p>${esc(t(line))}</p>`;
        })
        .join("");
    }

    /* ---- CSS ---- */

    function css() {
      var base = [
        `*{margin:0;padding:0;box-sizing:border-box}`,
        `body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-size:11px;line-height:1.55;color:${C.gray800};background:${C.gray200}}`,
        `@media print{body{background:${C.white};-webkit-print-color-adjust:exact;print-color-adjust:exact}}`,
        `@media print{@page{margin:0;size:A4}.page{box-shadow:none}}`,
        `.page{max-width:210mm;margin:0 auto;background:${C.white};overflow:hidden}`,
      ];

      var header = [
        `.top-stripe{height:5px;background:linear-gradient(90deg,#1e3a5f,#2563eb,${C.blue},${C.blueLt})}`,
        `.header{padding:28px 36px 20px}`,
        `.header h1{font-size:30px;font-weight:800;color:${C.navy};letter-spacing:-.5px;margin-bottom:2px}`,
        `.header .tagline{font-size:14px;color:${C.blue};font-weight:600;margin-bottom:10px}`,
        `.header .meta{font-size:11px;color:${C.gray500};display:flex;gap:6px;flex-wrap:wrap}`,
        `.header .meta span{display:flex;align-items:center}`,
        `.header .meta span+span::before{content:'\\00B7';margin:0 6px;color:${C.gray400};font-weight:700}`,
      ];

      var layout = [
        `.body-cols{display:flex;border-top:1px solid ${C.gray200}}`,
        `.sidebar{width:30%;background:${C.navy};color:${C.gray200};padding:26px 22px}`,
        `.main{width:70%;padding:24px 30px 26px}`,
      ];

      var sidebar = [
        `.sb-section{padding-bottom:16px;border-bottom:1px solid ${C.darkBg}}`,
        `.sb-section:last-child{border-bottom:0;padding-bottom:0}`,
        `.sb-section h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${C.blueLt};margin-bottom:12px}`,

        `.sb-contact{font-size:11px;line-height:2.1;color:${C.gray300}}`,
        `.sb-contact a{color:#93c5fd;text-decoration:none;border-bottom:1px dotted ${C.gray700};padding-bottom:1px}`,
        `.sb-contact .contact-row{display:flex;align-items:center;gap:8px;padding:3px 0}`,
        `.sb-contact .contact-row:not(:last-child){border-bottom:1px solid ${C.darkBg}}`,
        `.sb-contact .contact-dot{width:6px;height:6px;border-radius:50%;background:${C.blue};flex-shrink:0}`,

        `.lang-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;font-size:11px}`,
        `.lang-name{font-weight:600;color:${C.gray50}}`,
        `.lang-level{color:${C.gray400};font-size:10px;font-style:italic}`,

        `.skill-row{margin-bottom:9px}`,
        `.skill-cat{display:block;font-size:10px;font-weight:600;color:${C.blueLt};text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px}`,
        `.skill-items{display:block;font-size:10.5px;color:${C.gray300};line-height:1.6}`,
      ];

      var main = [
        `.main-section{margin-bottom:20px}`,
        `.main-section h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:${C.gray500};margin-bottom:14px;padding-bottom:6px;border-bottom:1px solid ${C.gray200};position:relative}`,
        `.main-section h2::after{content:'';position:absolute;bottom:-1px;left:0;width:36px;height:2px;background:${C.blue}}`,
        `.main-section.profile p{font-size:10.5px;color:${C.gray600};margin-bottom:5px;line-height:1.65}`,
        `.main-section.profile p:first-child{font-size:11.5px;color:${C.navy};font-weight:600}`,
      ];

      var exp = [
        `.exp-item{position:relative;margin-bottom:16px;padding-bottom:14px;padding-left:16px;border-bottom:1px solid ${C.gray100}}`,
        `.exp-item:last-child{border-bottom:0;margin-bottom:0;padding-bottom:0}`,
        `.exp-item::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;border-radius:2px;background:${C.gray300}}`,
        `.exp-item:first-of-type::before{background:${C.blue}}`,
        `.exp-item:first-of-type .exp-date{background:${C.bluePale};color:#2563eb}`,

        `.exp-head{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:3px}`,
        `.exp-title{font-size:13px;font-weight:700;color:${C.navy}}`,
        `.exp-company{font-size:11.5px;color:${C.blue};font-weight:600}`,
        `.exp-date{font-size:10px;color:${C.gray400};font-weight:500;margin-left:auto;background:${C.gray100};padding:2px 8px;border-radius:4px}`,
        `.exp-desc{font-size:10.5px;color:${C.gray600};line-height:1.55;margin:4px 0 5px}`,
        `.exp-tech{font-size:9.5px;color:${C.gray600};font-weight:600}`,
      ];

      var certs = [
        `.certs-grid{display:flex;flex-wrap:wrap;gap:7px 8px}`,
        `.cert-chip{font-size:10.5px;color:${C.gray700};background:${C.blueBg};padding:5px 14px;border-radius:20px;white-space:nowrap;border:1px solid #bfdbfe;font-weight:500}`,
        `.cert-chip .cert-year{color:${C.blue};font-size:9.5px;font-weight:700;margin-left:4px}`,
      ];

      return [base, header, layout, sidebar, main, exp, certs]
        .map(function (group) {
          return group.join("");
        })
        .join("");
    }

    /* ---- assemble ---- */

    return `<!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8"><title>${esc(name)}${t(" - Resume")}</title>
      <style>${css()}</style></head>
      <body>
      <div class="page">
        <div class="top-stripe"></div>
        <div class="header">
          <h1>${esc(name)}</h1>
          <div class="tagline">${esc(tagline)}</div>
          <div class="meta">
            <span>${esc(location)}</span>
            <span>${email}</span>
            <span>${phone}</span>
          </div>
        </div>
        <div class="body-cols">
          <div class="sidebar">
            <div class="sb-section">
              <h3>${t("Contact")}</h3>
              <div class="sb-contact">
                <div class="contact-row"><span class="contact-dot"></span>${email}</div>
                <div class="contact-row"><span class="contact-dot"></span>${phone}</div>
                <div class="contact-row"><span class="contact-dot"></span><a href="${gh}">github/${esc(config.username)}</a></div>
                <div class="contact-row"><span class="contact-dot"></span><a href="${li}">linkedin/in/otavio-zanon</a></div>
                <div class="contact-row"><span class="contact-dot"></span><a href="${web}">otaviozanon.vercel.app</a></div>
              </div>
            </div>
            <div class="sb-section">
              <h3>${t("Languages")}</h3>
              ${buildLangs()}
            </div>
            <div class="sb-section">
              <h3>${t("Skills")}</h3>
              ${buildSkills()}
            </div>
          </div>
          <div class="main">
            <div class="main-section profile">
              <h2>${t("Professional Profile")}</h2>
              ${buildSummary()}
            </div>
            <div class="main-section">
              <h2>${t("Experience")}</h2>
              ${buildExp()}
            </div>
            <div class="main-section">
              <h2>${t("Education")}</h2>
              ${buildEdu()}
            </div>
            <div class="main-section">
              <h2>${t("Certifications")}</h2>
              <div class="certs-grid">${buildCerts()}</div>
            </div>
          </div>
        </div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print()},200)}</script>
      </body></html>`
      .replace(/^\s+/gm, "")
      .replace(/\n/g, "");
  }

  return { build: build };
})();
