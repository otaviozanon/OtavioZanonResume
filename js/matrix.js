/* matrix.js — matrix rain animation */

window.__Matrix = (function () {
  "use strict";

  var FONT_SIZE = 14;
  var FADE_ALPHA = 0.12;
  var RESET_CHANCE = 0.975;
  var COLOR = "#39d353";

  var matrixOn = false;
  var animFrame = null;

  function isOn() {
    return matrixOn;
  }

  function toggle(canvas, chars) {
    matrixOn = !matrixOn;
    canvas.style.display = matrixOn ? "block" : "none";
    if (matrixOn) {
      start(canvas, chars);
    } else {
      if (animFrame) {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }
  }

  function start(canvas, chars) {
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var columnCount = Math.floor(canvas.width / FONT_SIZE);
    var drops = new Array(columnCount).fill(0);
    var charArray = chars.split("");

    function draw() {
      if (!matrixOn) return;
      ctx.fillStyle = "rgba(13,17,23," + FADE_ALPHA + ")";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLOR;
      ctx.font = FONT_SIZE + "px monospace";

      for (var i = 0; i < drops.length; i++) {
        var ch = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(ch, i * FONT_SIZE, drops[i] * FONT_SIZE);
        drops[i] = drops[i] * FONT_SIZE > canvas.height && Math.random() > RESET_CHANCE ? 0 : drops[i] + 1;
      }
      animFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  return { toggle: toggle, isOn: isOn };
})();
