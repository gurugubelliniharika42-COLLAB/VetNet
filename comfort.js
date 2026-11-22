/* VetNet comfort panel, break reminders and optional manual timer. No dependencies. */
(function () {
  "use strict";
  var KEY = "vetnet_comfort_v1";
  var D = { theme: "comfort", warm: 0, dim: 0, tsz: 100, lh: "relaxed", ls: "normal", rm: false, br: true, brMin: 20, timer: null, chime: false };
  var st = (function () { try { return Object.assign({}, D, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return Object.assign({}, D); } })();
  st.theme = ({ paper: "comfort", amber: "dark", night: "dark" })[st.theme] || st.theme;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function $(s, r) { return (r || document).querySelector(s); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var root = document.documentElement;
  var reduceOS = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resolved() { if (st.theme !== "auto") return st.theme; var h = new Date().getHours(); return h >= 7 && h < 18 ? "comfort" : "dark"; }
  function apply(fade) {
    if (fade && !st.rm && !reduceOS) { root.classList.add("cm-fade"); setTimeout(function () { root.classList.remove("cm-fade"); }, 800); }
    root.setAttribute("data-ct", resolved());
    root.style.setProperty("--tsz", st.tsz / 100);
    root.style.setProperty("--clh", { snug: 1.6, relaxed: 1.8, airy: 2.05 }[st.lh]);
    root.style.setProperty("--cls", { normal: "0em", wide: ".02em", wider: ".045em" }[st.ls]);
    if (st.rm) root.setAttribute("data-rm", "1"); else root.removeAttribute("data-rm");
    warm.style.opacity = st.warm / 100 * 0.75; dim.style.opacity = st.dim / 100;
    var m = document.querySelector('meta[name=theme-color]'); if (!m) { m = el("meta"); m.name = "theme-color"; document.head.appendChild(m); }
    m.content = { light: "#e9ece6", comfort: "#dde2d2", dark: "#14181a" }[resolved()];
  }
  var warm = el("div"); warm.id = "cmWarm"; warm.setAttribute("aria-hidden", "true");
  var dim = el("div"); dim.id = "cmDim"; dim.setAttribute("aria-hidden", "true");
  document.body.appendChild(warm); document.body.appendChild(dim);

  /* ---------- panel ---------- */
  var scrim = el("div", "cmScrim cm"), panel = el("aside", "cmPanel cm");
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Eye comfort"); panel.setAttribute("aria-modal", "true");
  var lastFocus = null;
  function seg(name, opts, cur) { return '<div class="seg" data-seg="' + name + '">' + opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
  function build() {
    panel.innerHTML =
      '<button class="cmX" type="button" aria-label="Close">&#10005;</button><h2>Eye comfort</h2><p class="sub">made for long reading, saves on this device</p>' +
      "<h3>Mode</h3>" + seg("theme", [["light", "Light"], ["comfort", "Eye comfort"], ["dark", "Dark"], ["auto", "Auto"]], st.theme) +
      '<p class="cmNote">Eye comfort is a soft sage with gentler contrast. Auto uses it by day and Dark after 6 pm.</p>' +
      '<h3>Light</h3><div class="cmRow"><label for="cmWarmR">Warmth<small>Reduces blue light</small></label><span class="cmVal" id="cmWarmV"></span></div><input id="cmWarmR" type="range" min="0" max="60" value="' + st.warm + '">' +
      '<div class="cmRow"><label for="cmDimR">Dimmer<small>Goes below your screen minimum</small></label><span class="cmVal" id="cmDimV"></span></div><input id="cmDimR" type="range" min="0" max="60" value="' + st.dim + '">' +
      "<h3>Text</h3>" + '<div class="cmRow"><label for="cmSzR">Text size</label><span class="cmVal" id="cmSzV"></span></div><input id="cmSzR" type="range" min="85" max="150" step="5" value="' + st.tsz + '">' +
      '<div class="cmRow"><span class="l">Line spacing</span></div>' + seg("lh", [["snug", "Snug"], ["relaxed", "Relaxed"], ["airy", "Airy"]], st.lh) +
      '<div class="cmRow"><span class="l">Letter spacing</span></div>' + seg("ls", [["normal", "Normal"], ["wide", "Wide"], ["wider", "Wider"]], st.ls) +
      "<h3>Comfort</h3>" +
      '<div class="cmRow"><label for="cmRm">Reduce motion<small>No sliding or fading</small></label><input id="cmRm" class="sw" type="checkbox" role="switch"' + (st.rm ? " checked" : "") + "></div>" +
      '<div class="cmRow"><label for="cmBr">Gentle break reminders<small>Every <b id="cmBrM">' + st.brMin + '</b> min, never blocks reading</small></label><input id="cmBr" class="sw" type="checkbox" role="switch"' + (st.br ? " checked" : "") + "></div>" +
      '<div class="cmRow"><label for="cmFo">Focus mode<small id="cmFoS">Hides menus while you read a topic</small></label><input id="cmFo" class="sw" type="checkbox" role="switch"' + (document.body.classList.contains("focus") ? " checked" : "") + "></div>" +
      '<h3>My own timer (optional)</h3><div class="cmRow"><label for="cmMin">Remind me in<small>minutes (1 to 240)</small></label><input id="cmMin" class="cmNum" type="number" min="1" max="240" inputmode="numeric" value="25"></div>' +
      '<div class="chips" id="cmPre">' + [15, 25, 45, 60].map(function (m) { return '<button type="button" data-m="' + m + '">' + m + " min</button>"; }).join("") + "</div>" +
      '<input id="cmLab" class="cmTxt" maxlength="60" placeholder="Note to self (optional), like: drink water">' +
      '<div class="cmRow"><label for="cmCh">Soft chime<small>Plays when time is up</small></label><input id="cmCh" class="sw" type="checkbox" role="switch"' + (st.chime ? " checked" : "") + "></div>" +
      '<div class="cmRow" style="gap:8px"><button class="cmBtn" type="button" id="cmGo">Start timer</button><button class="cmBtn ghost" type="button" id="cmStop">Cancel timer</button></div>' +
      '<button class="cmBtn ghost cmReset" type="button" id="cmReset">Reset to defaults</button>';
    labels();
  }
  function labels() { var a = $("#cmWarmV"), b = $("#cmDimV"), c = $("#cmSzV"); if (a) a.textContent = st.warm + "%"; if (b) b.textContent = st.dim + "%"; if (c) c.textContent = st.tsz + "%"; }
  function open() { lastFocus = document.activeElement; build(); scrim.classList.add("on"); panel.classList.add("on"); var x = $(".cmX", panel); x && x.focus(); }
  function close() { scrim.classList.remove("on"); panel.classList.remove("on"); lastFocus && lastFocus.focus && lastFocus.focus(); }
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("on")) close();
    if (e.key === "Tab" && panel.classList.contains("on")) { var f = panel.querySelectorAll("button,input"); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  panel.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.classList.contains("cmX")) return close();
    var sg = t.closest("[data-seg]");
    if (sg) { st[sg.dataset.seg] = t.dataset.v; save(); apply(true); sg.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === t); }); return; }
    if (t.dataset.m) { $("#cmMin").value = t.dataset.m; return startTimer(+t.dataset.m, $("#cmLab").value); }
    if (t.id === "cmGo") { var v = Math.round(+$("#cmMin").value); if (!(v >= 1 && v <= 240)) { $("#cmMin").focus(); return; } return startTimer(v, $("#cmLab").value); }
    if (t.id === "cmStop") return cancelTimer();
    if (t.id === "cmReset") { var keep = st.timer; st = Object.assign({}, D, { timer: keep }); save(); apply(true); schedBreak(); build(); }
  });
  panel.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "cmWarmR") st.warm = +t.value; else if (t.id === "cmDimR") st.dim = +t.value; else if (t.id === "cmSzR") st.tsz = +t.value; else return;
    labels(); save(); apply(false);
  });
  panel.addEventListener("change", function (e) {
    var t = e.target;
    if (t.id === "cmRm") { st.rm = t.checked; save(); apply(false); }
    else if (t.id === "cmBr") { st.br = t.checked; save(); schedBreak(); }
    else if (t.id === "cmCh") { st.chime = t.checked; save(); if (t.checked) chime(); }
    else if (t.id === "cmFo") {
      var rd = document.getElementById("reader");
      if (!rd) { t.checked = false; $("#cmFoS").textContent = "Open a topic first, then switch this on"; return; }
      document.body.classList.toggle("focus", t.checked);
    }
  });

  /* ---------- topbar button ---------- */
  function mountBtn() {
    var old = document.getElementById("themeBtn"), b = el("button", "", "<span aria-hidden=\"true\">&#128065;</span> Comfort");
    b.id = "cmBtn"; b.type = "button"; b.setAttribute("aria-haspopup", "dialog"); b.title = "Eye comfort";
    if (old) { old.style.display = "none"; old.parentNode.insertBefore(b, old); } else document.body.appendChild(b);
    b.addEventListener("click", open);
  }

  /* ---------- sound ---------- */
  function chime() {
    try { var C = new (window.AudioContext || window.webkitAudioContext)(), t = C.currentTime;[523.25, 659.25, 783.99].forEach(function (f, i) { var o = C.createOscillator(), g = C.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t + i * .18); g.gain.linearRampToValueAtTime(.12, t + i * .18 + .04); g.gain.exponentialRampToValueAtTime(.0001, t + i * .18 + 1.1); o.connect(g); g.connect(C.destination); o.start(t + i * .18); o.stop(t + i * .18 + 1.2); }); } catch (e) {}
  }

  /* ---------- 20-20-20 break reminder ---------- */
  var brk = el("div", "brk"); brk.setAttribute("role", "region"); brk.setAttribute("aria-label", "Break reminder");
  var brTimer = null, brCount = null, activeMs = 0, lastTick = Date.now(), brOpen = false;
  brk.innerHTML = '<div class="top"><div class="ring" id="brRing"><span id="brSec">20</span></div><div><h4>Time for a short rest</h4><p style="margin:0">Look at something far away for 20 seconds and blink slowly.</p></div></div><div class="acts"><button class="p" type="button" data-a="done">I rested</button><button type="button" data-a="later">Remind me in 10 min</button></div><button class="off" type="button" data-a="off">Turn off reminders</button>';
  function showBreak() {
    if (brOpen || tmOv.classList.contains("on")) return; brOpen = true; brk.classList.add("on");
    var s = 20; $("#brSec", brk).textContent = s; $("#brRing", brk).style.setProperty("--p", 0);
    clearInterval(brCount); brCount = setInterval(function () { s--; $("#brSec", brk).textContent = Math.max(s, 0); $("#brRing", brk).style.setProperty("--p", (20 - Math.max(s, 0)) / 20 * 100); if (s <= 0) clearInterval(brCount); }, 1000);
  }
  function hideBreak() { brOpen = false; brk.classList.remove("on"); clearInterval(brCount); }
  brk.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a]"); if (!a) return; a = a.dataset.a; hideBreak();
    if (a === "done") { activeMs = 0; } else if (a === "later") { activeMs = Math.max(0, st.brMin * 60000 - 10 * 60000); } else { st.br = false; save(); }
  });
  function schedBreak() { clearInterval(brTimer); activeMs = 0; lastTick = Date.now(); if (!st.br) return; brTimer = setInterval(function () { var n = Date.now(); if (!document.hidden) activeMs += Math.min(n - lastTick, 5000); lastTick = n; if (activeMs >= st.brMin * 60000) { activeMs = 0; showBreak(); } }, 1000); }
  document.addEventListener("visibilitychange", function () { lastTick = Date.now(); });

  /* ---------- optional manual timer ---------- */
  var chip = el("div"); chip.id = "cmChip"; chip.setAttribute("role", "timer");
  chip.innerHTML = '<span aria-hidden="true">&#9201;</span><span id="cmT">00:00</span><button type="button" aria-label="Cancel timer">&#10005;</button>';
  var tmOv = el("div", "tmOv"); tmOv.setAttribute("role", "alertdialog"); tmOv.setAttribute("aria-modal", "true"); tmOv.setAttribute("aria-labelledby", "tmH");
  var EM = [["&#9749;", "Chai time!", "Your reading time is up. Stretch your shoulders and sip something warm."], ["&#127807;", "Breathe out", "Time's up. Look at something green or far away for a minute."], ["&#128054;", "Good job, doctor!", "Even future vets need rest. Walk around for a few minutes."], ["&#128167;", "Water break", "Time's up. Have a glass of water and blink slowly."], ["&#127775;", "You earned this", "Time's up. Rest your eyes, the notes will wait."], ["&#128564;", "Eyes need a nap", "Close them for 20 seconds. Then come back fresh."], ["&#129496;", "Stretch it out", "Time's up. Roll your neck and shake out your hands."]];
  var tmTick = null, tmFire = null;
  function fmt(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); s %= 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m).padStart(2, "0")) + ":" + String(s).padStart(2, "0"); }
  function startTimer(min, label) { st.timer = { end: Date.now() + min * 60000, label: String(label || "").slice(0, 60) }; save(); runTimer(); close(); }
  function cancelTimer() { st.timer = null; save(); clearInterval(tmTick); chip.classList.remove("on"); }
  function runTimer() {
    clearInterval(tmTick); if (!st.timer) { chip.classList.remove("on"); return; }
    chip.classList.add("on");
    function tick() { if (!st.timer) return; var left = st.timer.end - Date.now(); $("#cmT", chip).textContent = fmt(left); if (left <= 0) fire(); }
    tick(); tmTick = setInterval(tick, 500);
  }
  function fire() {
    clearInterval(tmTick); var t = st.timer; st.timer = null; save(); chip.classList.remove("on"); if (!t) return;
    hideBreak(); var e = EM[Math.floor(Math.random() * EM.length)];
    tmOv.innerHTML = '<div class="tmBox"><span class="tmEmoji" aria-hidden="true">' + e[0] + '</span><h3 id="tmH">' + e[1] + "</h3><p>" + (t.label ? "<b>" + esc(t.label) + "</b><br>" : "") + e[2] + '</p><div class="acts"><button class="cmBtn" type="button" data-t="ok">I\'m back</button><button class="cmBtn ghost" type="button" data-t="5">+5 min</button></div></div>';
    tmOv.classList.add("on"); var b = $("[data-t=ok]", tmOv); b && b.focus(); if (st.chime) chime();
    var old = document.title; document.title = "⏰ Time's up – VetNet"; tmOv._old = old;
  }
  tmOv.addEventListener("click", function (e) {
    var b = e.target.closest("[data-t]"); if (!b) return; tmOv.classList.remove("on"); document.title = tmOv._old || document.title;
    if (b.dataset.t === "5") startTimer(5, ""); else activeMs = 0;
  });
  chip.querySelector("button").addEventListener("click", cancelTimer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && tmOv.classList.contains("on")) { tmOv.classList.remove("on"); document.title = tmOv._old || document.title; } });

  /* ---------- go ---------- */
  function init() {
    [scrim, panel, brk, chip, tmOv].forEach(function (n) { document.body.appendChild(n); });
    mountBtn(); apply(false); schedBreak(); runTimer();
    if (st.theme === "auto") setInterval(function () { apply(true); }, 60000);
  }
  if (document.body) init(); else document.addEventListener("DOMContentLoaded", init);
  window.VetNetComfort = { open: open, startTimer: startTimer, state: function () { return st; } };
})();
