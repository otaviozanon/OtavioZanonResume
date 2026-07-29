/* terminal.js - terminal interaction and command handlers */

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

    var langBtn = document.getElementById("langToggle");
    if (langBtn) {
      updateLangToggle();
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleLang();
        input.focus();
      });
    }

    loadData();
    updateChrome();
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

  function t(str) {
    if (!appConfig.i18n || !appConfig.i18n.pt) return str;
    if (appConfig.lang !== "pt") return str;
    return appConfig.i18n.pt[str] || str;
  }

  function updateLangToggle() {
    var btn = document.getElementById("langToggle");
    if (!btn) return;
    btn.textContent = appConfig.lang === "pt" ? "PT" : "EN";
    btn.title =
      appConfig.lang === "pt" ? "Mudar para Inglês" : "Switch to Portuguese";
  }

  function toggleLang() {
    appConfig.lang = appConfig.lang === "pt" ? "en" : "pt";
    updateLangToggle();
    updateChrome();
    term.innerHTML = "";
    boot();
  }

  function updateChrome() {
    var hint = document.querySelector(".hint");
    if (hint) {
      hint.innerHTML = t(
        "type <kbd>help</kbd> to see commands · try <kbd>projects</kbd>, <kbd>skills</kbd>, or <kbd>experience</kbd>",
      );
    }
    var taglineEl = document.querySelector(".tagline");
    if (taglineEl && appConfig.tagline) {
      taglineEl.textContent = t(appConfig.tagline);
    }
    var footerTagline = document.querySelector("footer .tagline-text");
    if (footerTagline && appConfig.footer && appConfig.footer.tagline) {
      footerTagline.textContent = t(appConfig.footer.tagline);
    }
    var footerLinks = document.querySelector("footer .links");
    if (footerLinks && appConfig.openLinks) {
      var html = "";
      var keys = Object.keys(appConfig.openLinks);
      keys.forEach(function (key, i) {
        var link = appConfig.openLinks[key];
        html +=
          '<a href="' +
          link.url +
          '" target="_blank" rel="noopener">' +
          t(link.label) +
          "</a>";
        if (i < keys.length - 1) html += "·";
      });
      footerLinks.innerHTML = html;
    }
    document.title = t(
      appConfig.siteTitle ||
        appConfig.username + "@github ~ interactive terminal",
    );
    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", t(appConfig.metaDescription) || "");
    }
    var footerDiv = document.querySelector("footer div:last-child");
    if (footerDiv && appConfig.footer && appConfig.footer.rendered) {
      footerDiv.textContent = t(appConfig.footer.rendered);
    }
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
        t(stat[2]) +
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
        '<span class="out-dim">' +
          t("command not found: ") +
          escapeHtml(cmd) +
          t(" - type 'help'") +
          "</span>",
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
      line('<span class="out-dim">' + t("opening ") + t(target) + "...</span>");
      window.open(map[target], "_blank");
    } else {
      var keys = Object.keys(appConfig.openLinks).map(t).join("|");
      line('<span class="out-dim">' + t("usage: open [") + keys + "]</span>");
    }
  }

  function buildHeatmapEl() {
    if (!contributionData || !contributionData.days) return null;
    return window.__Heatmap.build(tooltip, contributionData.days);
  }

  var COMMANDS = {
    help: function () {
      line('<span class="out-white">' + t("available commands:") + "</span>");
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
            t(entry[0]).padEnd(15) +
            '</span><span class="out-dim">' +
            t(entry[1]) +
            "</span>",
        );
      });
    },

    whoami: function () {
      line('<span class="out-cmd">' + t("whoami") + "/</span>");
      blank();
      (appConfig.whoami || []).forEach(function (text) {
        line('<span class="out-dim">' + escapeHtml(t(text)) + "</span>");
      });
      blank();
    },

    experience: function () {
      line('<span class="out-cmd">' + t("experience") + "/</span>");
      blank();
      (appConfig.experience || []).forEach(function (exp) {
        line(
          '<span class="out-green">' +
            escapeHtml(exp.period).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(t(exp.role)) +
            " (" +
            escapeHtml(exp.company) +
            ")" +
            "</span>",
        );
        line(
          '  <span class="out-dim">• ' + escapeHtml(t(exp.summary)) + "</span>",
        );
        line(
          '  <span class="out-yellow">' +
            t("tech:") +
            '</span> <span class="out-dim">' +
            escapeHtml(exp.tech) +
            "</span>",
        );
        blank();
      });
    },

    education: function () {
      line('<span class="out-cmd">' + t("education") + "/</span>");
      blank();

      line('<span class="out-green">' + t("> academic") + "</span>");
      (appConfig.education || []).forEach(function (edu) {
        line(
          '  <span class="out-green">' +
            escapeHtml(edu.period).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(t(edu.degree)) +
            '</span> <span class="out-dim">- ' +
            escapeHtml(edu.institution) +
            "</span>",
        );
      });

      blank();
      line('<span class="out-green">' + t("> languages") + "</span>");
      (appConfig.languages || []).forEach(function (lang) {
        line(
          '  <span class="out-green">' +
            escapeHtml(t(lang.level)).padEnd(13) +
            '</span><span class="out-white">' +
            escapeHtml(t(lang.language)) +
            "</span>",
        );
      });

      blank();
      line('<span class="out-green">' + t("> certifications") + "</span>");
      (appConfig.certifications || []).forEach(function (cert) {
        line(
          '  <span class="out-green">' +
            escapeHtml(cert.year).padEnd(7) +
            '</span><span class="out-white">' +
            escapeHtml(t(cert.name)).padEnd(48) +
            '</span><span class="out-dim">' +
            escapeHtml(cert.issuer) +
            "</span>",
        );
      });
    },

    skills: function () {
      var categories = appConfig.skillCategories || [];
      if (!categories.length) return;

      line('<span class="out-cmd">' + t("skills") + "/</span>");
      blank();

      categories.forEach(function (cat) {
        line(
          '<span class="out-green">&gt; ' +
            escapeHtml(t(cat.category)) +
            "/</span>",
        );
        line('  <span class="out-dim">' + escapeHtml(cat.items) + "</span>");
      });
    },

    projects: function () {
      var categories = appConfig.projectCategories || [];
      if (!categories.length) {
        line(
          '<span class="out-dim">' + t("no projects configured") + "</span>",
        );
        return;
      }

      line('<span class="out-cmd">' + t("projects") + "/</span>");
      blank();

      categories.forEach(function (cat) {
        line(
          '<span class="out-green">&gt; ' +
            escapeHtml(t(cat.category)) +
            "/</span>",
        );

        (cat.projects || []).forEach(function (project) {
          line(
            '  <span class="out-cmd">' +
              escapeHtml(project.name) +
              '</span> <span class="out-dim">- ' +
              escapeHtml(t(project.description)) +
              ' -</span> <span class="out-white">' +
              escapeHtml(project.tech) +
              "</span>",
          );

          var links = [];
          if (project.live) {
            links.push(
              '<span class="out-yellow">' +
                t("live:") +
                '</span> <a class="out-purple" href="' +
                project.live +
                '" target="_blank" rel="noopener">' +
                escapeHtml(project.live) +
                "</a>",
            );
          }
          if (project.code) {
            links.push(
              '<span class="out-yellow">' +
                t("code:") +
                '</span> <a class="out-purple" href="' +
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
      line('<span class="out-cmd">' + t("contact") + "/</span>");
      blank();
      (appConfig.contact || []).forEach(function (item) {
        line(
          '<span class="out-white">' +
            escapeHtml(t(item[0])).padEnd(10) +
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
      line(
        '<span class="out-dim">' + t("generating resume PDF...") + "</span>",
      );
      var html = window.__Resume.build(appConfig, escapeHtml, t);
      var blob = new Blob([html], { type: "text/html" });
      var url = URL.createObjectURL(blob);
      var w = window.open(url, "_blank");
      if (!w) {
        try {
          var a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (e) {
          line(
            '<span class="out-yellow">' +
              t("popup blocked - allow popups and try again") +
              "</span>",
          );
          URL.revokeObjectURL(url);
          return;
        }
      }
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 120000);
    },

    photo: function () {
      if (!appConfig.photoUrl) {
        line(
          '<span class="out-dim">' +
            t("no photo configured - add photoUrl in config.js") +
            "</span>",
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
        '<span class="out-yellow">' +
          t("[sudo] password for ") +
          escapeHtml(appConfig.username) +
          ':</span> <span class="out-dim">' +
          t("nice try. this is a static site.") +
          "</span>",
      );
    },
  };

  COMMANDS["about"] = COMMANDS.whoami;
  COMMANDS["ls"] = COMMANDS.projects;

  /* pt-BR aliases */
  COMMANDS["experiencia"] = COMMANDS.experience;
  COMMANDS["formacao"] = COMMANDS.education;
  COMMANDS["habilidades"] = COMMANDS.skills;
  COMMANDS["projetos"] = COMMANDS.projects;
  COMMANDS["contato"] = COMMANDS.contact;
  COMMANDS["baixar"] = COMMANDS.download;
  COMMANDS["limpar"] = COMMANDS.clear;
  COMMANDS["sobre"] = COMMANDS.whoami;

  function boot() {
    line(
      '<span class="out-green">' +
        t("connected to github.com/") +
        escapeHtml(appConfig.username) +
        "</span>",
    );
    line(
      '<span class="out-dim">' +
        t("type 'help' to see available commands") +
        "</span>",
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
