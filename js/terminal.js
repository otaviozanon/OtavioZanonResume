/* terminal.js — terminal interaction and command handlers */

window.__Terminal = (function () {
  "use strict";

  var term, input, tooltip, contributionData, appConfig;

  function init(termEl, inputEl, tooltipEl, configParam, heatmap) {
    term = termEl;
    input = inputEl;
    tooltip = tooltipEl;
    appConfig = configParam;
    window.__Heatmap = heatmap;

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        var userInput = input.value;
        input.value = "";
        runCommand(userInput);
      }
    });

    document.addEventListener("click", function () {
      input.focus();
    });

    loadData();
    boot();
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }

  function line(html, cls) {
    var div = document.createElement("div");
    div.className = "line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    term.appendChild(div);
    term.scrollTop = term.scrollHeight;
    return div;
  }

  function blank() {
    line("&nbsp;");
  }

  var COUNTER_DURATION_MS = 900;
  var COUNTER_EASING_POWER = 3;

  function countUp(el, target, suffix) {
    var start = performance.now();
    function tick(now) {
      var progress = Math.min(1, (now - start) / COUNTER_DURATION_MS);
      var value = Math.round(
        target * (1 - Math.pow(1 - progress, COUNTER_EASING_POWER)),
      );
      el.textContent = value.toLocaleString() + (suffix || "");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderStats() {
    if (!contributionData) return;
    var box = document.getElementById("statsBox");
    if (!box) return;
    var stats = [
      ["total", contributionData.total_contributions, "contributions"],
      ["current", contributionData.current_streak.length, "day streak"],
      ["longest", contributionData.longest_streak.length, "day best streak"],
      ["best", contributionData.best_day.count, "in one day"],
    ];
    box.innerHTML = "";
    stats.forEach(function (stat) {
      var card = document.createElement("div");
      card.className = "stat";
      card.innerHTML =
        '<div class="num" data-key="' +
        stat[0] +
        '">0</div><div class="lbl">' +
        stat[2] +
        "</div>";
      box.appendChild(card);
      countUp(card.querySelector(".num"), stat[1]);
    });
  }

  function loadData() {
    var url = appConfig.contributionsUrl;

    function useFallback() {
      contributionData = appConfig.fallbackData;
      if (contributionData) renderStats();
    }

    if (!url) {
      useFallback();
      return;
    }

    fetch(url, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("bad status " + response.status);
        return response.json();
      })
      .then(function (json) {
        contributionData = json;
        renderStats();
      })
      .catch(function () {
        useFallback();
      });
  }

  function runCommand(raw) {
    var trimmed = raw.trim();
    line(
      '<span class="prompt-tag">' +
        escapeHtml(appConfig.username) +
        '@github:~$</span> <span class="out-white">' +
        escapeHtml(trimmed) +
        "</span>",
      "prompt-line",
    );
    if (!trimmed) return;

    var parts = trimmed.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);

    if (cmd === "open") {
      cmdOpen(args);
      return;
    }

    if (COMMANDS[cmd]) {
      COMMANDS[cmd](args);
    } else {
      line(
        '<span class="out-dim">command not found: ' +
          escapeHtml(cmd) +
          " — type 'help'</span>",
      );
    }
  }

  function cmdOpen(args) {
    var target = (args[0] || "").toLowerCase();
    var map = {};
    Object.keys(appConfig.openLinks).forEach(function (key) {
      map[key] = appConfig.openLinks[key].url;
    });
    if (map[target]) {
      line('<span class="out-dim">opening ' + target + "...</span>");
      window.open(map[target], "_blank");
    } else {
      var keys = Object.keys(appConfig.openLinks).join("|");
      line('<span class="out-dim">usage: open [' + keys + "]</span>");
    }
  }

  function buildHeatmapEl() {
    if (!contributionData || !contributionData.days) return null;
    return window.__Heatmap.build(tooltip, contributionData.days);
  }

  function buildResumeHTML() {
    var whoami = appConfig.whoami || [];
    var experience = appConfig.experience || [];
    var education = appConfig.education || [];
    var certifications = appConfig.certifications || [];
    var languages = appConfig.languages || [];
    var skillCategories = appConfig.skillCategories || [];
    var contact = appConfig.contact || [];

    var name = whoami[0] || appConfig.username;
    var tagline = whoami[2] || appConfig.tagline;
    var location = whoami[1] || "";
    var summaryLines = whoami.slice(3);

    function phoneFromContact() {
      var item = contact.filter(function (c) { return c[0] === "phone"; })[0];
      return item ? item[2] : "";
    }
    function emailFromContact() {
      var item = contact.filter(function (c) { return c[0] === "email"; })[0];
      return item ? item[2] : "";
    }

    var expHtml = experience
      .map(function (exp) {
        return (
          '<div class="exp-item">' +
          '<div class="exp-head">' +
          '<span class="exp-title">' +
          escapeHtml(exp.role) +
          "</span>" +
          '<span class="exp-company">' +
          escapeHtml(exp.company) +
          "</span>" +
          '<span class="exp-date">' +
          escapeHtml(exp.period) +
          "</span>" +
          "</div>" +
          '<p class="exp-desc">' +
          escapeHtml(exp.summary) +
          "</p>" +
          '<p class="exp-tech">' +
          escapeHtml(exp.tech) +
          "</p>" +
          "</div>"
        );
      })
      .join("");

    var eduHtml = education
      .map(function (edu) {
        return (
          '<div class="exp-item" style="margin-bottom:0;padding-bottom:0;border:0">' +
          '<div class="exp-head">' +
          '<span class="exp-title">' +
          escapeHtml(edu.degree) +
          "</span>" +
          '<span class="exp-company">' +
          escapeHtml(edu.institution) +
          "</span>" +
          '<span class="exp-date">' +
          escapeHtml(edu.period) +
          "</span>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    var certHtml = certifications
      .map(function (cert) {
        return (
          '<div class="cert-chip">' +
          escapeHtml(cert.name) +
          ' <span class="cert-year">' +
          escapeHtml(cert.year) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var langHtml = languages
      .map(function (lang) {
        return (
          '<div class="lang-row">' +
          '<span class="lang-name">' +
          escapeHtml(lang.language) +
          "</span>" +
          '<span class="lang-level">' +
          escapeHtml(lang.level) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var skillsHtml = skillCategories
      .map(function (cat) {
        return (
          '<div class="skill-row">' +
          '<span class="skill-cat">' +
          escapeHtml(cat.category) +
          "</span>" +
          '<span class="skill-items">' +
          escapeHtml(cat.items) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var summaryHtml = summaryLines
      .map(function (line) {
        return "<p>" + escapeHtml(line) + "</p>";
      })
      .join("");

    return (
      "<!DOCTYPE html>" +
      '<html lang="en"><head><meta charset="utf-8">' +
      "<title>" +
      escapeHtml(name) +
      " — Resume</title>" +
      "<style>" +
      "*{margin:0;padding:0;box-sizing:border-box}" +
      "body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-size:11px;line-height:1.55;color:#1e293b;background:#e2e8f0}" +
      "@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}" +
      ".page{max-width:210mm;margin:0 auto;background:#fff;overflow:hidden}" +
      ".top-stripe{height:5px;background:linear-gradient(90deg,#1e3a5f,#2563eb,#3b82f6,#60a5fa)}" +
      ".header{padding:28px 36px 20px;position:relative}" +
      ".header h1{font-size:30px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;margin-bottom:2px}" +
      ".header .tagline{font-size:14px;color:#3b82f6;font-weight:600;margin-bottom:10px}" +
      ".header .meta{font-size:11px;color:#94a3b8;display:flex;gap:6px;flex-wrap:wrap}" +
      ".header .meta span{display:flex;align-items:center}" +
      ".header .meta span+span::before{content:'·';margin:0 6px;color:#cbd5e1;font-weight:700}" +
      ".body-cols{display:flex;border-top:1px solid #e2e8f0}" +
      ".sidebar{width:30%;background:#0f172a;color:#e2e8f0;padding:26px 22px}" +
      ".main{width:70%;padding:24px 30px 26px}" +
      ".sb-section{padding-bottom:16px;margin-bottom:0;border-bottom:1px solid #1a2235}" +
      ".sb-section:last-child{border-bottom:0;padding-bottom:0}" +
      ".sb-section h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#60a5fa;margin-bottom:12px}" +
      ".sb-contact{font-size:11px;line-height:2.1;color:#cbd5e1}" +
      ".sb-contact a{color:#93c5fd;text-decoration:none;border-bottom:1px dotted #334155;padding-bottom:1px}" +
      ".sb-contact .contact-row{display:flex;align-items:center;gap:8px;padding:3px 0}" +
      ".sb-contact .contact-row:not(:last-child){border-bottom:1px solid #1a2235}" +
      ".sb-contact .contact-dot{width:6px;height:6px;border-radius:50%;background:#3b82f6;flex-shrink:0}" +
      ".lang-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;font-size:11px}" +
      ".lang-name{font-weight:600;color:#f8fafc}" +
      ".lang-level{color:#94a3b8;font-size:10px;font-style:italic}" +
      ".skill-row{margin-bottom:9px}" +
      ".skill-cat{display:block;font-size:10px;font-weight:600;color:#60a5fa;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px}" +
      ".skill-items{display:block;font-size:10.5px;color:#cbd5e1;line-height:1.6}" +
      ".main-section{margin-bottom:20px}" +
      ".main-section h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:#94a3b8;margin-bottom:14px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;position:relative}" +
      ".main-section h2::after{content:'';position:absolute;bottom:-1px;left:0;width:36px;height:2px;background:#3b82f6}" +
      ".main-section.profile p{font-size:10.5px;color:#475569;margin-bottom:5px;line-height:1.65}" +
      ".main-section.profile p:first-child{font-size:11.5px;color:#0f172a;font-weight:600}" +
      ".exp-item{position:relative;margin-bottom:16px;padding-bottom:14px;padding-left:16px;border-bottom:1px solid #f1f5f9}" +
      ".exp-item:last-child{border-bottom:0;margin-bottom:0;padding-bottom:0}" +
      ".exp-item::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;border-radius:2px;background:#cbd5e1}" +
      ".exp-item:first-of-type::before{background:#3b82f6}" +
      ".exp-item:first-of-type .exp-date{background:#dbeafe;color:#2563eb}" +
      ".exp-head{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:3px}" +
      ".exp-title{font-size:13px;font-weight:700;color:#0f172a}" +
      ".exp-company{font-size:11.5px;color:#3b82f6;font-weight:600}" +
      ".exp-date{font-size:10px;color:#94a3b8;font-weight:500;margin-left:auto;background:#f1f5f9;padding:2px 8px;border-radius:4px}" +
      ".exp-desc{font-size:10.5px;color:#475569;line-height:1.55;margin:4px 0 5px}" +
      ".exp-tech{font-size:9.5px;color:#64748b;font-style:italic}" +
      ".certs-grid{display:flex;flex-wrap:wrap;gap:7px 8px}" +
      ".cert-chip{font-size:10.5px;color:#334155;background:#f0f7ff;padding:5px 14px;border-radius:20px;white-space:nowrap;border:1px solid #bfdbfe;font-weight:500}" +
      ".cert-chip .cert-year{color:#3b82f6;font-size:9.5px;font-weight:700;margin-left:4px}" +
      ".footer{text-align:center;font-size:8.5px;color:#cbd5e1;padding:8px 28px 10px}" +
      "@media print{@page{margin:0;size:A4}.page{box-shadow:none}}" +
      "</style></head><body>" +
      '<div class="page">' +
      '<div class="top-stripe"></div>' +
      '<div class="header">' +
      "<h1>" +
      escapeHtml(name) +
      "</h1>" +
      '<div class="tagline">' +
      escapeHtml(tagline) +
      "</div>" +
      '<div class="meta">' +
      '<span>' +
      escapeHtml(location) +
      "</span>" +
      '<span>' +
      emailFromContact() +
      "</span>" +
      '<span>' +
      phoneFromContact() +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="body-cols">' +
      '<div class="sidebar">' +
      '<div class="sb-section">' +
      '<h3>Contact</h3>' +
      '<div class="sb-contact">' +
      '<div class="contact-row"><span class="contact-dot"></span>' +
      emailFromContact() +
      "</div>" +
      '<div class="contact-row"><span class="contact-dot"></span>' +
      phoneFromContact() +
      "</div>" +
      '<div class="contact-row"><span class="contact-dot"></span><a href="' +
      (appConfig.openLinks.github ? appConfig.openLinks.github.url : "#") +
      '">github/' +
      escapeHtml(appConfig.username) +
      "</a></div>" +
      '<div class="contact-row"><span class="contact-dot"></span><a href="' +
      (appConfig.openLinks.linkedin ? appConfig.openLinks.linkedin.url : "#") +
      '">linkedin/in/otavio-zanon</a></div>' +
      '<div class="contact-row"><span class="contact-dot"></span><a href="' +
      (appConfig.openLinks.portfolio ? appConfig.openLinks.portfolio.url : "#") +
      '">otaviozanon.vercel.app</a></div>' +
      "</div>" +
      "</div>" +
      '<div class="sb-section">' +
      '<h3>Languages</h3>' +
      langHtml +
      "</div>" +
      '<div class="sb-section">' +
      '<h3>Skills</h3>' +
      skillsHtml +
      "</div>" +
      "</div>" +
      '<div class="main">' +
      '<div class="main-section profile">' +
      '<h2>Professional Profile</h2>' +
      summaryHtml +
      "</div>" +
      '<div class="main-section">' +
      '<h2>Experience</h2>' +
      expHtml +
      "</div>" +
      '<div class="main-section">' +
      '<h2>Education</h2>' +
      eduHtml +
      "</div>" +
      '<div class="main-section">' +
      '<h2>Certifications</h2>' +
      '<div class="certs-grid">' +
      certHtml +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="footer">otaviozanon.github.io</div>' +
      "</div>" +
      "</body></html>"
    );
  }

  var COMMANDS = {
    help: function () {
      line('<span class="out-white">available commands:</span>');
      [
        ["whoami", "professional summary"],
        ["experience", "work history"],
        ["education", "academic background & certifications"],
        ["skills", "tech stack"],
        ["projects", "projects by category"],
        ["contact", "how to reach me"],
        ["download", "generate resume PDF"],
        ["clear", "clear the terminal"],
      ].forEach(function (entry) {
        line(
          '  <span class="out-cmd">' +
            entry[0].padEnd(15) +
            '</span><span class="out-dim">' +
            entry[1] +
            "</span>",
        );
      });
    },

    whoami: function () {
      line('<span class="out-cmd">whoami/</span>');
      blank();
      (appConfig.whoami || []).forEach(function (text) {
        line('<span class="out-dim">' + escapeHtml(text) + "</span>");
      });
      blank();
    },

    experience: function () {
      line('<span class="out-cmd">experience/</span>');
      blank();
      (appConfig.experience || []).forEach(function (exp) {
        line(
          '<span class="out-green">' +
            escapeHtml(exp.period).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(exp.role) +
            " (" +
            escapeHtml(exp.company) +
            ")" +
            "</span>",
        );
        line(
          '  <span class="out-dim">• ' + escapeHtml(exp.summary) + "</span>",
        );
        line(
          '  <span class="out-yellow">tech:</span> <span class="out-dim">' +
            escapeHtml(exp.tech) +
            "</span>",
        );
        blank();
      });
    },

    education: function () {
      line('<span class="out-cmd">education/</span>');
      blank();

      line('<span class="out-green">&gt; academic</span>');
      (appConfig.education || []).forEach(function (edu) {
        line(
          '  <span class="out-green">' +
            escapeHtml(edu.period).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(edu.degree) +
            '</span> <span class="out-dim">— ' +
            escapeHtml(edu.institution) +
            "</span>",
        );
      });

      blank();
      line('<span class="out-green">&gt; languages</span>');
      (appConfig.languages || []).forEach(function (lang) {
        line(
          '  <span class="out-green">' +
            escapeHtml(lang.level).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(lang.language) +
            "</span>",
        );
      });

      blank();
      line('<span class="out-green">&gt; certifications</span>');
      (appConfig.certifications || []).forEach(function (cert) {
        line(
          '  <span class="out-green">' +
            escapeHtml(cert.year).padEnd(7) +
            '</span><span class="out-white">' +
            escapeHtml(cert.name).padEnd(48) +
            '</span><span class="out-dim">' +
            escapeHtml(cert.issuer) +
            "</span>",
        );
      });
    },

    skills: function () {
      var categories = appConfig.skillCategories || [];
      if (!categories.length) return;

      line('<span class="out-cmd">skills/</span>');
      blank();

      categories.forEach(function (cat) {
        line(
          '<span class="out-green">&gt; ' +
            escapeHtml(cat.category) +
            "/</span>",
        );
        line('  <span class="out-dim">' + escapeHtml(cat.items) + "</span>");
      });
    },

    projects: function () {
      var categories = appConfig.projectCategories || [];
      if (!categories.length) {
        line('<span class="out-dim">no projects configured</span>');
        return;
      }

      line('<span class="out-cmd">projects/</span>');
      blank();

      categories.forEach(function (cat) {
        line(
          '<span class="out-green">&gt; ' +
            escapeHtml(cat.category) +
            "/</span>",
        );

        (cat.projects || []).forEach(function (project) {
          line(
            '  <span class="out-cmd">' +
              escapeHtml(project.name) +
              '</span> <span class="out-dim">— ' +
              escapeHtml(project.description) +
              ' —</span> <span class="out-white">' +
              escapeHtml(project.tech) +
              "</span>",
          );

          var links = [];
          if (project.live) {
            links.push(
              '<span class="out-yellow">live:</span> <a class="out-purple" href="' +
                project.live +
                '" target="_blank" rel="noopener">' +
                escapeHtml(project.live) +
                "</a>",
            );
          }
          if (project.code) {
            links.push(
              '<span class="out-yellow">code:</span> <a class="out-purple" href="' +
                project.code +
                '" target="_blank" rel="noopener">' +
                escapeHtml(project.code) +
                "</a>",
            );
          }
          if (links.length) {
            line("  " + links.join('  <span class="out-dim">·</span>  '));
          }
        });

        blank();
      });
    },

    contact: function () {
      line('<span class="out-cmd">contact/</span>');
      blank();
      (appConfig.contact || []).forEach(function (item) {
        line(
          '<span class="out-white">' +
            escapeHtml(item[0]).padEnd(10) +
            '</span> <a class="out-purple" href="' +
            item[1] +
            '" target="_blank" rel="noopener">' +
            escapeHtml(item[2]) +
            "</a>",
        );
      });
      blank();
    },

    download: function () {
      line('<span class="out-dim">generating resume PDF...</span>');
      var html = buildResumeHTML();
      var w = window.open("", "_blank");
      if (!w) {
        line('<span class="out-yellow">popup blocked — allow popups and try again</span>');
        return;
      }
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(function () {
        w.print();
      }, 400);
    },

    photo: function () {
      if (!appConfig.photoUrl) {
        line(
          '<span class="out-dim">no photo configured — add photoUrl in config.js</span>',
        );
        return;
      }
      var img = document.createElement("img");
      img.src = appConfig.photoUrl;
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.border = "1px solid var(--frame)";
      img.alt = "photo";
      var div = document.createElement("div");
      div.className = "line";
      div.appendChild(img);
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
    },

    banner: function () {
      line(
        '<pre style="color:var(--green);margin:0;font-size:9px;font-family:inherit;">' +
          escapeHtml(appConfig.banner) +
          "</pre>",
      );
    },

    clear: function () {
      term.innerHTML = "";
    },

    sudo: function (args) {
      line(
        '<span class="out-yellow">[sudo] password for ' +
          escapeHtml(appConfig.username) +
          ':</span> <span class="out-dim">nice try. this is a static site.</span>',
      );
    },
  };

  COMMANDS["about"] = COMMANDS.whoami;
  COMMANDS["ls"] = COMMANDS.projects;

  function boot() {
    line(
      '<span class="out-green">connected to github.com/' +
        escapeHtml(appConfig.username) +
        "</span>",
    );
    line(
      "<span class=\"out-dim\">type 'help' to see available commands</span>",
    );
    blank();

    var statsWrap = document.createElement("div");
    statsWrap.className = "line";
    statsWrap.innerHTML = '<div class="stats" id="statsBox"></div>';
    term.appendChild(statsWrap);

    blank();
    runCommand("whoami");
    input.focus();
  }

  return {
    init: init,
    runCommand: runCommand,
    getData: function () {
      return contributionData;
    },
  };
})();
