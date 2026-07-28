/* heatmap.js — contribution heatmap rendering */

window.__Heatmap = (function () {
  "use strict";

  var DAYS_PER_WEEK = 7;
  var TOOLTIP_OFFSET = 14;
  var PALETTE = ["#1c2128", "#0e4429", "#146c37", "#26a648", "#39d353", "#7cf2a0"];

  function levelFor(count) {
    if (count === 0) return 0;
    if (count <= 5) return 1;
    if (count <= 15) return 2;
    if (count <= 30) return 3;
    if (count <= 50) return 4;
    return 5;
  }

  function build(tooltip, days) {
    var wrap = document.createElement("div");
    wrap.className = "heatmap-wrap";

    var grid = document.createElement("div");
    grid.className = "heatmap";

    var firstDate = new Date(days[0].date + "T00:00:00");
    var leadPad = firstDate.getDay();
    var currentColumn = new Array(leadPad).fill(null);
    var columns = [];

    days.forEach(function (day) {
      var date = new Date(day.date + "T00:00:00");
      var weekday = date.getDay();
      while (currentColumn.length < weekday) currentColumn.push(null);
      currentColumn.push(day);
      if (currentColumn.length === DAYS_PER_WEEK) {
        columns.push(currentColumn);
        currentColumn = [];
      }
    });
    if (currentColumn.length) {
      while (currentColumn.length < DAYS_PER_WEEK) currentColumn.push(null);
      columns.push(currentColumn);
    }

    columns.forEach(function (column) {
      column.forEach(function (day) {
        var cell = document.createElement("div");
        cell.className = "cell";
        if (!day) {
          cell.style.background = "transparent";
          cell.style.cursor = "default";
        } else {
          var level = levelFor(day.count);
          cell.style.background = PALETTE[level];
          cell.addEventListener("mousemove", function (event) {
            tooltip.style.display = "block";
            tooltip.style.left = event.clientX + TOOLTIP_OFFSET + "px";
            tooltip.style.top = event.clientY + TOOLTIP_OFFSET + "px";
            tooltip.textContent = day.date + ": " + day.count + " contribution" + (day.count === 1 ? "" : "s");
          });
          cell.addEventListener("mouseleave", function () {
            tooltip.style.display = "none";
          });
        }
        grid.appendChild(cell);
      });
    });

    wrap.appendChild(grid);

    var legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML = "less ";
    PALETTE.forEach(function (color) {
      legend.innerHTML += '<span class="cell" style="background:' + color + '"></span> ';
    });
    legend.innerHTML += " more";
    wrap.appendChild(legend);

    return wrap;
  }

  return { build: build, PALETTE: PALETTE };
})();
