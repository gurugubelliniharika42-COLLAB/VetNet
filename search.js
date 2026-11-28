/* VetNet global search (add-on). Press / or Ctrl+K, or tap the magnifier in the top bar.
   Searches topic titles, topic text, glossary, MCQs, flashcards and the Diagrams. Does not change script.js. */
(function () {
  "use strict";
  var IDX = null, ov, inp, out, sel, subj = "", last = "", active = -1, items = [], timer, LIM = 8, expanded = {};
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function flat(x) { if (x == null) return ""; if (typeof x === "string") return x; if (typeof x === "number") return ""; if (Array.isArray(x)) return x.map(flat).join(" \n"); if (typeof x === "object") return Object.keys(x).map(function (k) { return flat(x[k]); }).join(" \n"); return ""; }
  function sname(s) { try { return SUBJ[s] ? SUBJ[s].name : s; } catch (e) { return s; } }

  function build() {
    if (IDX) return IDX;
    IDX = { topics: [], gloss: [], mcq: [], flash: [], diag: [] };
    if (typeof TOPICS !== "undefined") TOPICS.forEach(function (t) {
      var raw = flat([t.i, t.sm, t.n, t.tb, t.k, t.m, t.sa, t.la, t.d]);
      IDX.topics.push({ id: t.id, s: t.s, title: t.t, tl: t.t.toLowerCase(), raw: raw, low: raw.toLowerCase() });
      (t.q || []).forEach(function (q, i) { var r = q[0] + " " + flat(q[1]) + " " + (q[3] || ""); IDX.mcq.push({ id: t.id, s: t.s, title: q[0], raw: r, low: r.toLowerCase() }); });
      (t.f || []).forEach(function (f) { var r = f[0] + " " + f[1]; IDX.flash.push({ id: t.id, s: t.s, title: f[0], raw: r, low: r.toLowerCase() }); });
    });
    if (typeof GLOSS !== "undefined") GLOSS.forEach(function (g) { var r = g[0] + " " + g[2]; IDX.gloss.push({ s: g[1], title: g[0], raw: r, low: r.toLowerCase() }); });
    try { if (window.VetNetDiagrams) window.VetNetDiagrams.list().forEach(function (d) { IDX.diag.push({ id: d.id, s: d.subj, title: d.title, tl: d.title.toLowerCase(), raw: d.text, low: d.text.toLowerCase() }); }); } catch (e) {}
    return IDX;
  }
  function rx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function terms(q) { return q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6); }
  function wordAt(low, t) { var p = low.indexOf(t); while (p >= 0) { if (p === 0 || !/[a-z0-9]/.test(low.charAt(p - 1))) return p; p = low.indexOf(t, p + 1); } return -1; }
  function all(low, ts) { for (var i = 0; i < ts.length; i++) if (wordAt(low, ts[i]) < 0) return false; return true; }
  function snippet(raw, ts, len) {
    var low = raw.toLowerCase(), p = -1, i;
    for (i = 0; i < ts.length; i++) { var k = wordAt(low, ts[i]); if (k >= 0 && (p < 0 || k < p)) p = k; }
    if (p < 0) p = 0;
    var a = Math.max(0, p - 50), b = Math.min(raw.length, p + (len || 120)), s = raw.slice(a, b).replace(/\s+/g, " ");
    return (a > 0 ? "…" : "") + hl(s, ts) + (b < raw.length ? "…" : "");
  }
  function hl(text, ts) {
    if (!ts.length) return esc(text);
    var re = new RegExp("(^|[^A-Za-z0-9])(" + ts.map(rx).join("|") + ")", "gi"), out = "", last = 0, m;
    while ((m = re.exec(text))) { var st = m.index + m[1].length; out += esc(text.slice(last, st)) + "<mark>" + esc(m[2]) + "</mark>"; last = st + m[2].length; if (m[0] === "") re.lastIndex++; }
    return out + esc(text.slice(last));
  }

  function run(q) {
    var ts = terms(q), I = build(), R = { topics: [], body: [], diag: [], gloss: [], mcq: [], flash: [] };
    if (!ts.length) return R;
    function ok(o) { return !subj || o.s === subj; }
    I.topics.forEach(function (t) {
      if (!ok(t)) return;
      if (all(t.tl, ts)) R.topics.push({ sc: (t.tl === q.toLowerCase() ? 100 : t.tl.indexOf(ts[0]) === 0 ? 80 : 60), o: t });
      else if (all(t.low + " " + t.tl, ts)) R.body.push({ sc: 10, o: t });
    });
    I.diag.forEach(function (d) { if (ok(d) && all(d.low + " " + d.tl, ts)) R.diag.push({ sc: all(d.tl, ts) ? 70 : 20, o: d }); });
    I.gloss.forEach(function (g) { if (ok(g) && all(g.low, ts)) R.gloss.push({ sc: g.title.toLowerCase().indexOf(ts[0]) === 0 ? 75 : 30, o: g }); });
    I.mcq.forEach(function (m) { if (ok(m) && all(m.low, ts)) R.mcq.push({ sc: 5, o: m }); });
    I.flash.forEach(function (f) { if (ok(f) && all(f.low, ts)) R.flash.push({ sc: 4, o: f }); });
    Object.keys(R).forEach(function (k) { R[k].sort(function (a, b) { return b.sc - a.sc; }); });
    R.ts = ts; return R;
  }
  var GROUPS = [["topics", "Topics"], ["diag", "Diagrams"], ["gloss", "Glossary"], ["body", "Mentioned inside topics"], ["mcq", "Practice questions"], ["flash", "Flashcards"]];
  function draw() {
    var q = inp.value.trim(); last = q; items = []; active = -1;
    if (q.length < 2) { out.innerHTML = '<p class="gsHint">Type at least 2 letters. Try <b>rumen</b>, <b>milk fever</b> or <b>Kjeldahl</b>.</p>'; return; }
    var R = run(q), h = "", n = 0;
    GROUPS.forEach(function (g) {
      var list = R[g[0]]; if (!list.length) return;
      var lim = expanded[g[0]] ? 60 : LIM;
      h += '<h3 class="gsH">' + g[1] + ' <span>' + list.length + "</span></h3><ul class='gsList'>";
      list.slice(0, lim).forEach(function (r) {
        var o = r.o, href, title = esc(o.title), sub = "";
        if (g[0] === "diag") { href = "#diagrams/" + o.id; sub = "Diagram"; title = hl(o.title, R.ts); }
        else if (g[0] === "gloss") { href = "#glossary"; title = hl(o.title, R.ts); sub = snippet(o.raw.slice(o.title.length), R.ts, 140); }
        else if (g[0] === "topics") { href = "#reader/" + o.id; title = hl(o.title, R.ts); }
        else { href = "#reader/" + o.id; sub = snippet(o.raw, R.ts, 130); if (g[0] === "mcq" || g[0] === "flash") title = hl(o.title.length > 140 ? o.title.slice(0, 140) + "…" : o.title, R.ts), sub = ""; if (g[0] === "body") { title = esc(o.title); } }
        h += '<li><a class="gsItem" role="option" data-i="' + n + '" href="' + href + '" data-gl="' + (g[0] === "gloss" ? esc(o.title) : "") + '"><span class="gsT">' + title + '</span>' + (sub ? '<span class="gsS">' + (g[0] === "gloss" || g[0] === "body" ? sub : esc(sub)) + "</span>" : "") + '<span class="gsM">' + esc(sname(o.s)) + (g[0] === "mcq" ? " · question" : g[0] === "flash" ? " · flashcard" : "") + "</span></a></li>";
        items.push(href); n++;
      });
      h += "</ul>" + (list.length > lim ? '<button type="button" class="gsMore" data-more="' + g[0] + '">Show all ' + list.length + "</button>" : "");
    });
    out.innerHTML = h || '<p class="gsHint">Nothing found for <b>' + esc(q) + "</b>. Check the spelling, or try one word.</p>";
  }
  function setActive(i) {
    var els = out.querySelectorAll(".gsItem"); if (!els.length) return;
    active = (i + els.length) % els.length;
    [].forEach.call(els, function (e, k) { e.classList.toggle("on", k === active); e.setAttribute("aria-selected", k === active); });
    els[active].scrollIntoView({ block: "nearest" });
  }
  function open(prefill) {
    if (!ov) return; ov.hidden = false; document.body.classList.add("gsOpen");
    if (typeof prefill === "string") inp.value = prefill;
    expanded = {}; draw(); setTimeout(function () { inp.focus(); inp.select(); }, 30);
  }
  function close() { if (!ov) return; ov.hidden = true; document.body.classList.remove("gsOpen"); }
  function go(a) {
    var g = a.getAttribute("data-gl"), href = a.getAttribute("href"), q = last; close();
    if (g) { location.hash = "#glossary"; setTimeout(function () { var gi = document.getElementById("gSearch"); if (gi) { gi.value = g; gi.dispatchEvent(new Event("input", { bubbles: true })); } }, 80); return; }
    if (href.indexOf("#reader/") === 0) { try { sessionStorage.setItem("vetnet_search_q", q); } catch (e) {} }
    location.hash = href;
  }
  function highlightInReader() {
    var q; try { q = sessionStorage.getItem("vetnet_search_q"); sessionStorage.removeItem("vetnet_search_q"); } catch (e) {} if (!q) return;
    var ts = terms(q); if (!ts.length) return;
    setTimeout(function () {
      var body = document.querySelector("#reader .body"); if (!body) return;
      var w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null), nodes = [], n, re = new RegExp("(^|[^A-Za-z0-9])(" + ts.map(rx).join("|") + ")", "i"), first = null;
      while ((n = w.nextNode())) if (re.test(n.nodeValue) && n.parentNode.nodeName !== "MARK" && !/^(SCRIPT|STYLE|BUTTON)$/.test(n.parentNode.nodeName)) nodes.push(n);
      nodes.slice(0, 40).forEach(function (n) {
        var span = document.createElement("span"); span.innerHTML = hl(n.nodeValue, ts).replace(/<mark>/g, '<mark class="gsFound">'); n.parentNode.replaceChild(span, n); if (!first) first = span.querySelector("mark");
      });
      if (first) first.scrollIntoView({ block: "center" });
    }, 120);
  }
  function mount() {
    if (document.getElementById("gsOv")) return;
    ov = document.createElement("div"); ov.id = "gsOv"; ov.className = "gsOv"; ov.hidden = true; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Search VetNet");
    var opts = '<option value="">All subjects</option>'; try { SUBJECTS.forEach(function (s) { opts += '<option value="' + s.id + '">' + esc(s.name) + "</option>"; }); } catch (e) {}
    ov.innerHTML = '<div class="gsBox"><div class="gsTop"><input id="gsIn" type="search" autocomplete="off" spellcheck="false" placeholder="Search topics, terms, diagrams, questions…" aria-label="Search"><select id="gsSub" aria-label="Subject">' + opts + '</select><button type="button" class="gsX" aria-label="Close search">✕</button></div><div id="gsOut" class="gsOut" role="listbox" aria-live="polite"></div><p class="gsFoot"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</p></div>';
    document.body.appendChild(ov); inp = ov.querySelector("#gsIn"); out = ov.querySelector("#gsOut"); sel = ov.querySelector("#gsSub");
    var bar = document.querySelector(".topbar"), th = document.getElementById("themeBtn");
    if (bar && !document.getElementById("gsBtn")) { var b = document.createElement("button"); b.id = "gsBtn"; b.type = "button"; b.className = "iconbtn"; b.setAttribute("aria-label", "Search (press /)"); b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>'; b.addEventListener("click", function () { open(); }); if (th) bar.insertBefore(b, th); else bar.appendChild(b); }
    inp.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { expanded = {}; draw(); }, 120); });
    sel.addEventListener("change", function () { subj = sel.value; expanded = {}; draw(); inp.focus(); });
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest(".gsX")) return close();
      var m = e.target.closest("[data-more]"); if (m) { expanded[m.getAttribute("data-more")] = true; return draw(); }
      var a = e.target.closest(".gsItem"); if (a) { e.preventDefault(); go(a); }
    });
    ov.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") { var els = out.querySelectorAll(".gsItem"); var a = els[active >= 0 ? active : 0]; if (a) { e.preventDefault(); go(a); } }
    });
    document.addEventListener("keydown", function (e) {
      var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); open(); }
    });
    window.addEventListener("hashchange", highlightInReader);
    window.VetNetSearch = { open: open, close: close };
    if (window.requestIdleCallback) requestIdleCallback(function () { build(); }, { timeout: 4000 }); else setTimeout(build, 3000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();