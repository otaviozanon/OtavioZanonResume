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
