/* VetNet notifications: a bell and a popup when the VetNet Team replies to YOUR feedback or comment.
   Works only on this device: it remembers which feedback and comments you posted. */
(function () {
  "use strict";
  var API = function () { return String(window.VETNET_FEED_API || "").trim(); };
  var K_MINE = "vetnet_fb3_mine", K_MYCM = "vetnet_fb3_mycm", K_SEEN = "vetnet_owner_seen", K_TOAST = "vetnet_owner_toast", K_CID = "vetnet_cid";
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hash(s) { var h = 5381, i; s = String(s); for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function cut(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  var BELL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  var PAW = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><g fill="currentColor"><ellipse cx="5.5" cy="11" rx="2.1" ry="2.8"/><ellipse cx="9.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="14.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="18.5" cy="11" rx="2.1" ry="2.8"/><path d="M12 11.5c-3 0-5.5 2.7-5.5 5.2 0 1.8 1.4 2.8 2.9 2.8 1 0 1.6-.4 2.6-.4s1.6.4 2.6.4c1.5 0 2.9-1 2.9-2.8 0-2.5-2.5-5.2-5.5-5.2z"/></g></svg>';
  var found = [], btn, badge, panel, toast, toastT, lastCheck = 0, busy = false;

  function hasPosts() { return (lsGet(K_MINE, []).length + lsGet(K_MYCM, []).length) > 0; }
  function seen() { return lsGet(K_SEEN, {}); }
  function unseen() { var s = seen(); return found.filter(function (r) { return !s[r.key]; }); }
  function markSeen(list) { var s = seen(); list.forEach(function (r) { s[r.key] = 1; }); var ks = Object.keys(s); if (ks.length > 300) ks.slice(0, ks.length - 300).forEach(function (k) { delete s[k]; }); lsSet(K_SEEN, s); paint(); }

  function scan(items) {
    var mine = lsGet(K_MINE, []).map(function (x) { return x.id; }), mycm = lsGet(K_MYCM, []).map(function (x) { return x.id; });
    found = [];
    (Array.isArray(items) ? items : []).forEach(function (it) {
      if (it && it.owner && mine.indexOf(it.id) > -1) found.push({ key: "f:" + it.id + ":" + hash(it.owner), kind: "feedback", fid: it.id, text: String(it.owner) });
      ((it && it.comments) || []).forEach(function (c) { if (c && c.owner && mycm.indexOf(c.id) > -1) found.push({ key: "c:" + c.id + ":" + hash(c.owner), kind: "comment", fid: it.id, text: String(c.owner), on: String(c.text || "") }); });
    });
    ensureBell(); paint(); announce();
  }

  function ensureBell() {
    if (btn || !hasPosts()) return;
    btn = document.createElement("button"); btn.id = "ntBtn"; btn.type = "button"; btn.className = "ntBtn";
    btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Replies from the VetNet Team");
    btn.innerHTML = BELL + '<span class="ntDot" hidden></span>';
    badge = btn.querySelector(".ntDot");
    var cm = document.getElementById("cmBtn"), top = document.querySelector(".topbar");
    if (cm && cm.parentNode) cm.parentNode.insertBefore(btn, cm); else if (top) top.appendChild(btn); else document.body.appendChild(btn);
    btn.addEventListener("click", function (e) { e.stopPropagation(); togglePanel(); });
    document.addEventListener("click", function (e) { if (panel && !panel.contains(e.target) && e.target !== btn) closePanel(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closePanel(); hideToast(); } });
  }
  function paint() {
    if (!btn) return; var n = unseen().length;
    badge.hidden = !n; badge.textContent = n > 9 ? "9+" : String(n);
    btn.setAttribute("aria-label", n ? n + " new " + (n === 1 ? "reply" : "replies") + " from the VetNet Team" : "Replies from the VetNet Team");
    btn.classList.toggle("has", !!n);
    if (panel) fillPanel();
  }
  function togglePanel() { if (panel) closePanel(); else openPanel(); }
  function openPanel() {
    panel = document.createElement("div"); panel.className = "ntPanel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Replies from the VetNet Team");
    document.body.appendChild(panel); fillPanel(); btn.setAttribute("aria-expanded", "true");
    var r = btn.getBoundingClientRect(); panel.style.top = Math.round(r.bottom + 8) + "px";
    panel.style.right = Math.max(10, Math.round(window.innerWidth - r.right - 4)) + "px";
  }
  function closePanel() { if (!panel) return; panel.remove(); panel = null; if (btn) btn.setAttribute("aria-expanded", "false"); }
  function fillPanel() {
    var s = seen(), list = found.slice().sort(function (a, b) { return (s[a.key] ? 1 : 0) - (s[b.key] ? 1 : 0); }), h = '<h3>From the VetNet Team</h3>';
    if (!list.length) h += '<p class="ntEmpty">No replies yet. When the VetNet Team replies to your feedback or comment, it will show up here.</p>';
    else h += '<ul>' + list.map(function (r, i) {
      return '<li><button type="button" data-i="' + i + '" class="' + (s[r.key] ? "" : "new") + '"><span class="ntK">' + (r.kind === "feedback" ? "Reply to your feedback" : "Reply to your comment") + (s[r.key] ? "" : ' <i>new</i>') + '</span><span class="ntT">' + esc(cut(r.text, 140)) + '</span></button></li>';
    }).join("") + "</ul>";
    panel.innerHTML = h;
    [].forEach.call(panel.querySelectorAll("li button"), function (b) { b.addEventListener("click", function () { var r = list[+b.dataset.i]; markSeen([r]); closePanel(); go(r); }); });
  }
  function go(r) { if (window.VetNetFeedback && window.VetNetFeedback.show) window.VetNetFeedback.show(r.fid, r.kind === "comment"); }

  /* popup for brand-new replies (once per reply) */
  function announce() {
    var told = lsGet(K_TOAST, []), fresh = unseen().filter(function (r) { return told.indexOf(r.key) < 0; });
    if (!fresh.length) return;
    fresh.forEach(function (r) { told.push(r.key); }); lsSet(K_TOAST, told.slice(-300));
    showToast(fresh);
  }
  function showToast(list) {
    hideToast(); var r = list[0], many = list.length > 1;
    toast = document.createElement("div"); toast.className = "ntToast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
    toast.innerHTML = '<span class="ntMed" aria-hidden="true">' + PAW + '</span><div class="ntBody"><b>' + (many ? list.length + " new replies from the VetNet Team" : "VetNet Team replied to you") + '</b><p>' + esc(cut(r.text, 110)) + '</p><div class="ntAct"><button type="button" class="ntGo">Read ' + (many ? "replies" : "reply") + '</button><button type="button" class="ntLater">Later</button></div></div><button type="button" class="ntX" aria-label="Close">×</button>';
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast && toast.classList.add("on"); });
    toast.querySelector(".ntGo").addEventListener("click", function () { var t = list.slice(); hideToast(); if (many) { ensureBell(); openPanel(); } else { markSeen([r]); go(r); } });
    toast.querySelector(".ntLater").addEventListener("click", hideToast);
    toast.querySelector(".ntX").addEventListener("click", hideToast);
    clearTimeout(toastT); toastT = setTimeout(hideToast, 15000);
    toast.addEventListener("mouseenter", function () { clearTimeout(toastT); });
  }
  function hideToast() { clearTimeout(toastT); if (!toast) return; var t = toast; toast = null; t.classList.remove("on"); setTimeout(function () { t.remove(); }, 300); }

  /* checking the server (only if you have posted something) */
  function check() {
    if (busy || !API() || !hasPosts()) return; busy = true; lastCheck = Date.now();
    var cid = lsGet(K_CID, "");
    fetch(API() + (API().indexOf("?") > -1 ? "&" : "?") + "cid=" + encodeURIComponent(cid) + "&t=" + Date.now()).then(function (r) { return r.json(); })
      .then(function (j) { busy = false; if (j && Array.isArray(j.items)) scan(j.items); }).catch(function () { busy = false; });
  }
  window.addEventListener("vetnet:wall", function (e) { var items = e.detail; scan(items); markSeen(found); });
  window.addEventListener("vetnet:name", function () { ensureBell(); setTimeout(check, 1500); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && Date.now() - lastCheck > 120000) check(); });
  function init() { ensureBell(); setTimeout(check, 3000); setInterval(function () { if (!document.hidden) check(); }, 300000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();