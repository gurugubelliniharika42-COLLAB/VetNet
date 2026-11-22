/* VetNet public feedback wall: reads moderated entries, shows average + cards. Needs script.js feedback form for "Add yours". */
(function () {
  "use strict";
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var PAW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="currentColor"><ellipse cx="5.5" cy="11" rx="2.1" ry="2.8"/><ellipse cx="9.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="14.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="18.5" cy="11" rx="2.1" ry="2.8"/><path d="M12 11c-3.2 0-6 3.2-6 5.7 0 1.9 1.6 2.8 3.2 2.8 1 0 1.8-.4 2.8-.4s1.8.4 2.8.4c1.6 0 3.2-.9 3.2-2.8 0-2.5-2.8-5.7-6-5.7z"/></g></svg>';
  var items = [], filter = 0, remote = [], ov, body;
  function clean(x, own) { var r = Math.max(0, Math.min(5, Math.round(+x.rating || 0))); return { name: String(x.name || (own ? "You" : "A VetNet reader")).slice(0, 60), rating: r, text: String(x.text || "").slice(0, 600), tags: (Array.isArray(x.tags) ? x.tags : String(x.tags || "").split(/[;,]/)).map(function (s) { return String(s).trim(); }).filter(Boolean).slice(0, 4), date: String(x.date || "").slice(0, 10), own: !!own }; }
  function ownItems() { try { var s = JSON.parse(localStorage.getItem("vetnet_feedback_v1") || "{}"); return (s.items || []).filter(function (i) { return i.msg || i.rating; }).map(function (i) { return clean({ name: "You", rating: i.rating, text: i.msg, tags: i.cat, date: new Date(i.t).toISOString().slice(0, 10) }, true); }); } catch (e) { return []; } }
  function all() { return ownItems().concat((window.VETNET_FEEDBACK || []).map(function (x) { return clean(x); }), remote); }
  function paws(n) { var s = ""; for (var i = 1; i <= 5; i++) s += '<span style="color:' + (i <= n ? "var(--accent)" : "var(--line)") + '">' + PAW + "</span>"; return '<span class="fwP" role="img" aria-label="' + n + ' out of 5">' + s + "</span>"; }
  function render() {
    var list = all(), pub = list.filter(function (x) { return !x.own; }), rated = pub.filter(function (x) { return x.rating; });
    var avg = rated.length ? rated.reduce(function (a, x) { return a + x.rating; }, 0) / rated.length : 0;
    var h = '<div class="fwTop"><div><h2 id="fwH">What readers say</h2><p class="fwSub">Real feedback from students using VetNet.</p></div><button class="cmBtn ghost" type="button" data-fw="close" aria-label="Close">&#10005;</button></div>';
    if (rated.length) {
      var dist = [5, 4, 3, 2, 1].map(function (n) { var c = rated.filter(function (x) { return x.rating === n; }).length; return '<div class="fwBar"><span>' + n + '</span><i><b style="width:' + Math.round(c / rated.length * 100) + '%"></b></i><em>' + c + "</em></div>"; }).join("");
      h += '<div class="fwStat"><div class="fwAvg"><strong>' + avg.toFixed(1) + "</strong>" + paws(Math.round(avg)) + "<small>" + rated.length + " rating" + (rated.length > 1 ? "s" : "") + "</small></div><div class=\"fwDist\">" + dist + "</div></div>";
    }
    h += '<div class="chips fwF">' + [["0", "All"], ["5", "5 paws"], ["4", "4 paws"], ["3", "3 and below"]].map(function (f) { return '<button type="button" data-f="' + f[0] + '" aria-pressed="' + (String(filter) === f[0]) + '">' + f[1] + "</button>"; }).join("") + "</div>";
    var shown = list.filter(function (x) { return !filter || (filter === 3 ? x.rating <= 3 : x.rating === filter); });
    if (!shown.length) h += '<div class="fwEmpty"><p>' + (list.length ? "Nothing here for this filter." : "No public feedback yet. Be the first to tell us how VetNet is working for you.") + "</p></div>";
    else h += shown.map(function (x) { return '<article class="fwC' + (x.own ? " own" : "") + '"><div class="fwH">' + paws(x.rating) + "<b>" + esc(x.name) + "</b>" + (x.own ? '<span class="fwY">only on this device</span>' : "") + (x.date ? "<time>" + esc(x.date) + "</time>" : "") + "</div>" + (x.text ? "<p>" + esc(x.text) + "</p>" : "") + (x.tags.length ? '<div class="fwT">' + x.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") + "</article>"; }).join("");
    h += '<div class="fwFoot"><button class="cmBtn" type="button" data-fw="add">Add yours</button></div>';
    body.innerHTML = h;
  }
  function open() { if (!ov) build(); render(); ov.classList.add("on"); document.body.style.overflow = "hidden"; var c = ov.querySelector("[data-fw=close]"); c && c.focus(); loadRemote(); }
  function close() { ov && ov.classList.remove("on"); document.body.style.overflow = ""; }
  function build() {
    ov = el("div", "fwOv"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-labelledby", "fwH");
    body = el("div", "fwBox"); ov.appendChild(body); document.body.appendChild(ov);
    ov.addEventListener("click", function (e) {
      if (e.target === ov) return close();
      var b = e.target.closest("[data-fw],[data-f]"); if (!b) return;
      if (b.dataset.fw === "close") close();
      else if (b.dataset.fw === "add") { close(); var o = document.createElement("button"); o.setAttribute("data-fb", ""); o.hidden = true; document.body.appendChild(o); o.click(); o.remove(); }
      else if (b.dataset.f != null) { filter = +b.dataset.f; render(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.classList.contains("on")) close(); });
  }
  var loaded = false;
  function loadRemote() {
    var u = window.VETNET_FEED_URL; if (!u || loaded) return; loaded = true;
    fetch(u).then(function (r) { return r.text(); }).then(function (t) { remote = parse(t); render(); }).catch(function () {});
  }
  function parse(t) {
    try { var j = JSON.parse(t); return (Array.isArray(j) ? j : []).map(function (x) { return clean(x); }); } catch (e) {}
    var rows = [], cur = [], f = "", q = false;
    for (var i = 0; i < t.length; i++) { var c = t[i]; if (q) { if (c === '"' && t[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; } else if (c === '"') q = true; else if (c === ",") { cur.push(f); f = ""; } else if (c === "\n") { cur.push(f); rows.push(cur); cur = []; f = ""; } else if (c !== "\r") f += c; }
    if (f || cur.length) { cur.push(f); rows.push(cur); }
    var hd = (rows.shift() || []).map(function (s) { return s.trim().toLowerCase(); });
    return rows.map(function (r) { var o = {}; hd.forEach(function (k, i) { o[k] = r[i]; }); return clean(o); }).filter(function (x) { return x.text || x.rating; });
  }
  /* capture phase: our wall opens first for nav "Feedback"; the form still opens from "Add yours" */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fb]"); if (!b || b.hidden || b.closest(".fwOv")) return;
    if (b.matches('a[href="#feedback"]') || b.classList.contains("fblink")) { e.preventDefault(); e.stopImmediatePropagation(); open(); }
  }, true);
  window.VetNetWall = { open: open, parse: parse };
})();
