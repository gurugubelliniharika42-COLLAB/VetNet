/* VetNet feedback v2: shared wall, form (name, rating, many options + "specify"), likes, comments and replies. */
(function () {
  "use strict";
  var API = function () { return String(window.VETNET_FEED_API || "").trim(); };
  var LIKES = ["Clear notes", "Easy to read", "Good MCQs", "Eye comfort modes", "Exam prep help", "Diagrams", "Other (please specify)"];
  var IMPROVE = ["More MCQs", "More diagrams", "Errors or bugs", "More topics", "Faster loading", "Other language support", "Other (please specify)"];
  var HINT = ["", "Needs a lot of work", "Could be better", "It's okay", "Really good", "Love it!"];
  var K_MINE = "vetnet_fb3_mine", K_NAME = "vetnet_user_name", K_OLD = "vetnet_fb3_name", K_Q = "vetnet_fb3_queue", K_CACHE = "vetnet_fb3_cache", K_CID = "vetnet_cid", K_LIKED = "vetnet_fb3_liked";
  var PAW = '<svg viewBox="0 0 24 24" width="SZ" height="SZ" aria-hidden="true"><g fill="currentColor"><ellipse cx="5.5" cy="11" rx="2.1" ry="2.8"/><ellipse cx="9.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="14.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="18.5" cy="11" rx="2.1" ry="2.8"/><path d="M12 11c-3.2 0-6 3.2-6 5.7 0 1.9 1.6 2.8 3.2 2.8 1 0 1.8-.4 2.8-.4s1.8.4 2.8.4c1.6 0 3.2-.9 3.2-2.8 0-2.5-2.8-5.7-6-5.7z"/></g></svg>';
  var HEART = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 5 6.2 5c2 0 3.5 1.1 5.8 3.4C14.3 6.1 15.8 5 17.8 5 21 5 23.1 8.3 21.6 11.8 19.5 16.4 12 21 12 21z"/></svg>';
  function paw(n) { return PAW.replace(/SZ/g, n); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function uid() { return "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function cid() { var c = lsGet(K_CID, ""); if (!c) { c = "c" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); lsSet(K_CID, c); } return c; }
  function userName() { return lsGet(K_NAME, "") || lsGet(K_OLD, "") || ""; }
  function tagList(a) { return (Array.isArray(a) ? a : []).map(function (x) { return String(x).slice(0, 120); }).filter(function (x) { return !rude(x); }).slice(0, 8); }
  function rude(t) { try { return !!(window.VETNET_SAFE && window.VETNET_SAFE.bad(t)); } catch (e) { return false; } }
  function reserved(t) { try { return !!(window.VETNET_SAFE && window.VETNET_SAFE.reserved(t)); } catch (e) { return false; } }
  var RES = "That name is reserved for the VetNet team. Please use your own name.";
  var KIND = "Please keep it kind. Remove the rude words and try again.";
  function normC(c) { return { id: String(c.id || ""), parent: String(c.parent || ""), name: rude(c.name) ? "A reader" : String(c.name || "A reader").slice(0, 40), text: rude(c.text) ? "" : String(c.text || "").slice(0, 1000), owner: String(c.owner || "").slice(0, 2000), time: String(c.time || "") }; }
  function norm(x) {
    return { id: String(x.id || ""), name: rude(x.name) ? "A VetNet reader" : String(x.name || "A VetNet reader").slice(0, 40), rating: Math.max(0, Math.min(5, Math.round(+x.rating || 0))), likes: tagList(x.likes), improve: tagList(x.improve), message: rude(x.message) ? "" : String(x.message || "").slice(0, 2000), owner: String(x.owner || "").slice(0, 2000), time: String(x.time || ""), hearts: Math.max(0, +x.hearts || 0), comments: (Array.isArray(x.comments) ? x.comments : []).map(normC).filter(function (c) { return c.text; }) };
  }

  /* ---------- data ---------- */
  var retryT, remote = [], liked = lsGet(K_LIKED, []), state = "idle", filter = 0, shown = 15, open = {}, drafts = {}, replyTo = {}, cmErr = {};
  function mineIds() { return lsGet(K_MINE, []).map(function (m) { return m.id; }); }
  function allItems() {
    var mine = lsGet(K_MINE, []), have = {}, out = remote.slice(), mi = mineIds();
    remote.forEach(function (x) { have[x.id] = 1; });
    mine.forEach(function (m) { if (!have[m.id]) out.push(norm(m)); });
    out = out.concat((window.VETNET_FEEDBACK || []).map(function (x) { var n = norm(x); n.id = ""; return n; }));
    out.forEach(function (x) { x.own = !!x.id && mi.indexOf(x.id) > -1; });
    return out.sort(function (a, b) { return (b.time || "").localeCompare(a.time || ""); });
  }
  function load() {
    if (!API()) { state = "noapi"; render(); return; }
    var c = lsGet(K_CACHE, null); if (c && c.length && !remote.length) remote = c.map(norm);
    state = remote.length ? "ok" : "loading"; render();
    fetch(API() + (API().indexOf("?") > -1 ? "&" : "?") + "cid=" + encodeURIComponent(cid()) + "&t=" + Date.now()).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !Array.isArray(j.items)) throw 0;
      remote = j.items.map(norm); lsSet(K_CACHE, remote); if (Array.isArray(j.liked)) { liked = j.liked; lsSet(K_LIKED, liked); } state = "ok"; render();
    }).catch(function () { state = remote.length ? "stale" : "error"; render(); });
  }
  function post(p) { return fetch(API(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) }).then(function (r) { return r.json(); }); }
  function flush() { var q = lsGet(K_Q, []); if (!q.length || !API()) return; var p = q[0]; post(p).then(function (j) { if (j && (j.ok || j.error === "bad")) { q.shift(); lsSet(K_Q, q); if (q.length) flush(); } }).catch(function () {}); }
  function find(id) { for (var i = 0; i < remote.length; i++) if (remote[i].id === id) return remote[i]; return null; }

  /* ---------- wall ---------- */
  var ov, box;
  function ensure() {
    if (ov) return; ov = el("div", "fwOv"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); box = el("div", "fwBox"); ov.appendChild(box); document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) return close(); var b = e.target.closest("[data-a]"); if (b) act(b.dataset.a, b); });
    ov.addEventListener("input", function (e) { var t = e.target; if (t.dataset && t.dataset.draft) { drafts[t.dataset.draft] = t.value; if (cmErr[t.dataset.draft]) { cmErr[t.dataset.draft] = ""; var er = box.querySelector('[data-err="' + t.dataset.draft + '"]'); if (er) er.textContent = ""; } } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.classList.contains("on")) close(); });
  }
  function showOv() { ensure(); ov.classList.add("on"); document.body.style.overflow = "hidden"; }
  function close() { if (!ov) return; ov.classList.remove("on"); document.body.style.overflow = ""; }
  function stars(n) { var s = ""; for (var i = 1; i <= 5; i++) s += '<span style="color:' + (i <= n ? "var(--accent)" : "var(--line)") + '">' + paw(18) + "</span>"; return '<span class="fwP" role="img" aria-label="' + n + ' out of 5">' + s + "</span>"; }
  function when(t) { if (!t) return ""; var d = new Date(t); if (isNaN(d)) return esc(String(t).slice(0, 10)); return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
  var CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function ownHtml(t, sm) { return t ? '<div class="fwOwn' + (sm ? " sm" : "") + '"><span class="fwOwnH">' + CHECK + 'VetNet Team <i>replied</i></span><p>' + esc(t) + "</p></div>" : ""; }
  function cmHtml(c, mi, replyable) { return '<div class="fwCmI' + (c.parent ? " rep" : "") + '"><div class="fwCmH"><b>' + esc(c.name) + "</b>" + (c.time ? "<time>" + when(c.time) + "</time>" : "") + "</div><p>" + esc(c.text) + "</p>" + ownHtml(c.owner, true) + (replyable ? '<button class="fwLink" type="button" data-a="reply" data-id="' + esc(c.fid) + '" data-c="' + esc(c.id) + '" data-n="' + esc(c.name) + '">Reply</button>' : "") + "</div>"; }
  function commentsHtml(x) {
    var tops = x.comments.filter(function (c) { return !c.parent; }), h = '<div class="fwCm">';
    tops.forEach(function (c) { c.fid = x.id; h += cmHtml(c, 0, true); x.comments.filter(function (r) { return r.parent === c.id; }).forEach(function (r) { r.fid = x.id; h += cmHtml(r, 0, false); }); });
    if (!tops.length) h += '<p class="fwNote" style="text-align:left">No comments yet. Say something kind!</p>';
    var rt = replyTo[x.id], nm = userName();
    h += '<div class="fwCmF">' + (rt ? '<p class="fwRep">Replying to <b>' + esc(rt.n) + '</b> <button class="fwLink" type="button" data-a="unreply" data-id="' + esc(x.id) + '">cancel</button></p>' : "");
    if (!nm) h += '<input class="ffIn" data-draft="nm-' + esc(x.id) + '" maxlength="40" placeholder="Your name" value="' + esc(drafts["nm-" + x.id] || "") + '" aria-label="Your name" style="margin-bottom:8px">';
    h += '<textarea class="ffIn" data-draft="' + esc(x.id) + '" maxlength="1000" placeholder="' + (rt ? "Write a reply…" : "Write a comment…") + '" aria-label="Comment">' + esc(drafts[x.id] || "") + '</textarea><p class="ffErr" data-err="' + esc(x.id) + '">' + esc(cmErr[x.id] || "") + '</p><button class="ffBtn" type="button" data-a="sendcm" data-id="' + esc(x.id) + '" style="min-height:40px;padding:8px 16px">' + (rt ? "Send reply" : "Send comment") + "</button></div></div>";
    return h;
  }
  function render() {
    if (!box || !ov.classList.contains("on") || ov.dataset.v !== "wall") return;
    var list = allItems(), rated = list.filter(function (x) { return x.rating; }), avg = rated.length ? rated.reduce(function (a, x) { return a + x.rating; }, 0) / rated.length : 0, social = !!API();
    var h = '<div class="fwTop"><div><h2 id="fwH">What readers say</h2><p class="fwSub">feedback from students using VetNet</p></div><button class="fwX" type="button" data-a="close" aria-label="Close">&#10005;</button></div>';
    if (rated.length) {
      var dist = [5, 4, 3, 2, 1].map(function (n) { var c = rated.filter(function (x) { return x.rating === n; }).length; return '<div class="fwBar"><span>' + n + '</span><i><b style="width:' + Math.round(c / rated.length * 100) + '%"></b></i><em>' + c + "</em></div>"; }).join("");
      h += '<div class="fwStat"><div class="fwAvg"><strong>' + avg.toFixed(1) + "</strong>" + stars(Math.round(avg)) + "<small>" + rated.length + " rating" + (rated.length > 1 ? "s" : "") + '</small></div><div class="fwDist">' + dist + "</div></div>";
    }
    if (state === "loading") h += '<div class="fwSk"></div><div class="fwSk"></div><div class="fwSk"></div>';
    else {
      if (state === "error") h += '<p class="fwNote">Connecting to the feedback wall…</p>';
      if (state === "stale") h += '<p class="fwNote">Showing the last saved list. You may be offline.</p>';
      if (state === "noapi") h += '<p class="fwNote">Only feedback from this device is shown. The site owner has not connected the shared wall yet.</p>';
      h += '<div class="chips" role="group" aria-label="Filter">' + [[0, "All"], [5, "5 paws"], [4, "4 paws"], [3, "3 and below"]].map(function (f) { return '<button type="button" data-a="f" data-f="' + f[0] + '" aria-pressed="' + (filter === f[0]) + '">' + f[1] + "</button>"; }).join("") + "</div>";
      var f = list.filter(function (x) { return !filter || (filter === 3 ? x.rating <= 3 : x.rating === filter); });
      if (!f.length) h += '<div class="fwEmpty"><p>' + (list.length ? "Nothing here for this filter." : "No feedback yet. Be the first!") + "</p></div>";
      else {
        h += f.slice(0, shown).map(function (x) {
          var isL = liked.indexOf(x.id) > -1, can = social && x.id && find(x.id);
          return '<article class="fwC' + (x.own ? " own" : "") + '"><div class="fwH">' + stars(x.rating) + "<b>" + esc(x.name) + "</b>" + (x.own ? '<span class="fwY">You</span>' : "") + (x.time ? "<time>" + when(x.time) + "</time>" : "") + "</div>" + (x.message ? "<p>" + esc(x.message) + "</p>" : "") +
            ownHtml(x.owner, false) +
            ((x.likes.length || x.improve.length) ? '<div class="fwT">' + x.likes.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + x.improve.map(function (t) { return '<span class="fix">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
            (can ? '<div class="fwAct"><button type="button" class="fwBtn' + (isL ? " on" : "") + '" data-a="like" data-id="' + esc(x.id) + '" aria-pressed="' + isL + '" aria-label="Like">' + HEART + "<span>" + x.hearts + '</span></button><button type="button" class="fwBtn" data-a="cm" data-id="' + esc(x.id) + '" aria-expanded="' + !!open[x.id] + '">&#128172; <span>' + x.comments.length + "</span> Comment" + (x.comments.length === 1 ? "" : "s") + "</button></div>" + (open[x.id] ? commentsHtml(x) : "") : "") + "</article>";
        }).join("");
        if (f.length > shown) h += '<div class="fwFoot"><button class="ffBtn ghost" type="button" data-a="more">Show more (' + (f.length - shown) + ")</button></div>";
      }
    }
    h += '<div class="fwFoot"><button class="ffBtn" type="button" data-a="add">Add your feedback</button></div>';
    var keep = box.scrollTop; box.innerHTML = h; box.scrollTop = keep;
  }
  function openWall() { ensure(); ov.dataset.v = "wall"; ov.setAttribute("aria-labelledby", "fwH"); showOv(); render(); load(); var c = box.querySelector("[data-a=close]"); c && c.focus(); }

  /* ---------- form ---------- */
  var rating = 0, busy = false;
  function chipSet(items, grp) { return '<div class="chips" role="group" data-g="' + grp + '">' + items.map(function (t) { return '<button type="button" data-a="chip" data-g="' + grp + '" aria-pressed="false">' + esc(t) + "</button>"; }).join("") + "</div>"; }
  function openForm() {
    ensure(); ov.dataset.v = "form"; ov.setAttribute("aria-labelledby", "ffH"); rating = 0; busy = false; var nm = userName();
    box.innerHTML = '<div class="fwTop"><div><h2 id="ffH">How\'s VetNet treating you?</h2><p class="fwSub">everyone can see your feedback, so be kind and honest</p></div><button class="fwX" type="button" data-a="close" aria-label="Close">&#10005;</button></div>' +
      '<form id="ffForm" novalidate><label class="ffL" for="ffName">Your name <i>(shown with your feedback)</i></label><input class="ffIn" id="ffName" maxlength="40" autocomplete="name" placeholder="Like: Anitha, 2nd year BVSc" value="' + esc(nm) + '"><p class="ffErr" id="ffEN"></p>' +
      '<span class="ffL" id="ffRL">Your rating</span><div class="ffRate" role="radiogroup" aria-labelledby="ffRL">' + [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" role="radio" aria-checked="false" aria-label="' + i + ' paw' + (i > 1 ? "s" : "") + '" data-a="rate" data-r="' + i + '">' + paw(34) + "</button>"; }).join("") + '<span class="ffHint" id="ffHint"></span></div><p class="ffErr" id="ffER"></p>' +
      '<span class="ffL">What worked for you <i>(pick any)</i></span>' + chipSet(LIKES, "likes") + '<div class="ffSp" id="sp-likes" hidden><input class="ffIn" id="ffOl" maxlength="100" placeholder="Please tell us what else worked for you"><p class="ffErr" id="ffEOl"></p></div>' +
      '<span class="ffL">What should improve <i>(pick any)</i></span>' + chipSet(IMPROVE, "improve") + '<div class="ffSp" id="sp-lang" hidden><input class="ffIn" id="ffLang" maxlength="60" placeholder="Which language? Like: Hindi, Tamil, Kannada"><p class="ffErr" id="ffELang"></p></div><div class="ffSp" id="sp-oi" hidden><input class="ffIn" id="ffOi" maxlength="100" placeholder="Please tell us what we should add or fix"><p class="ffErr" id="ffEOi"></p></div>' +
      '<label class="ffL" for="ffMsg">Tell us more <i>(optional)</i></label><textarea class="ffIn" id="ffMsg" maxlength="2000" placeholder="What helped you? What was confusing?"></textarea>' +
      '<input class="ffHp" id="ffHp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="ffErr" id="ffEG"></p><div class="fwFoot"><button class="ffBtn" type="submit" id="ffSend">Send feedback</button><button class="ffBtn ghost" type="button" data-a="wall">See what others said</button></div></form>';
    showOv(); var n = box.querySelector(nm ? "#ffMsg" : "#ffName"); n && n.focus();
    box.querySelector("#ffForm").addEventListener("submit", submit);
    box.querySelector("#ffName").addEventListener("input", function (e) { e.target.classList.remove("bad"); box.querySelector("#ffEN").textContent = ""; });
  }
  function setRating(n) { rating = n; box.querySelectorAll(".ffRate button").forEach(function (b) { b.classList.toggle("on", +b.dataset.r <= n); b.setAttribute("aria-checked", +b.dataset.r === n); }); box.querySelector("#ffHint").textContent = HINT[n] || ""; box.querySelector("#ffER").textContent = ""; }
  function on(g, label) { var b = [].filter.call(box.querySelectorAll('[data-g="' + g + '"] button'), function (x) { return x.textContent === label; })[0]; return !!b && b.getAttribute("aria-pressed") === "true"; }
  function picked(g) { return [].map.call(box.querySelectorAll('.chips[data-g="' + g + '"] [aria-pressed=true]'), function (b) { return b.textContent; }); }
  function syncSpecify() { box.querySelector("#sp-likes").hidden = !on("likes", "Other (please specify)"); box.querySelector("#sp-lang").hidden = !on("improve", "Other language support"); box.querySelector("#sp-oi").hidden = !on("improve", "Other (please specify)"); }
  function submit(e) {
    e.preventDefault(); if (busy) return; var q = function (s) { return box.querySelector(s); }, ok = true, first = null;
    function bad(id, msg, inp) { q(id).textContent = msg; if (inp) q(inp).classList.add("bad"); if (!first) first = q(inp || id); ok = false; }
    ["#ffEN", "#ffER", "#ffEG", "#ffEOl", "#ffELang", "#ffEOi"].forEach(function (s) { q(s).textContent = ""; });
    var name = q("#ffName").value.replace(/\s+/g, " ").trim(); if (name.length < 2) bad("#ffEN", "Please enter your name (at least 2 letters).", "#ffName");
    if (!rating) bad("#ffER", "Please tap a paw to rate.", null);
    var likes = picked("likes"), imp = picked("improve"), ol = q("#ffOl").value.trim(), lg = q("#ffLang").value.trim(), oi = q("#ffOi").value.trim();
    if (likes.indexOf("Other (please specify)") > -1) { if (!ol) bad("#ffEOl", "Please tell us what else worked.", "#ffOl"); else likes[likes.indexOf("Other (please specify)")] = "Other: " + ol; }
    if (imp.indexOf("Other language support") > -1) { if (!lg) bad("#ffELang", "Please tell us which language.", "#ffLang"); else imp[imp.indexOf("Other language support")] = "Language: " + lg; }
    if (imp.indexOf("Other (please specify)") > -1) { if (!oi) bad("#ffEOi", "Please tell us what to add or fix.", "#ffOi"); else imp[imp.indexOf("Other (please specify)")] = "Other: " + oi; }
    if (rude(name)) bad("#ffEN", "Please use a respectful name.", "#ffName");
    else if (reserved(name)) bad("#ffEN", RES, "#ffName");
    if (rude(q("#ffMsg").value)) bad("#ffEG", KIND, "#ffMsg");
    if (rude(ol)) bad("#ffEOl", KIND, "#ffOl");
    if (rude(lg)) bad("#ffELang", KIND, "#ffLang");
    if (rude(oi)) bad("#ffEOi", KIND, "#ffOi");
    if (!ok) { first && first.focus && first.focus(); return; }
    var p = { action: "feedback", id: uid(), name: name, rating: rating, likes: likes, improve: imp, message: q("#ffMsg").value.trim().slice(0, 2000), website: q("#ffHp").value };
    var mine = lsGet(K_MINE, []); mine.unshift({ id: p.id, name: name, rating: rating, likes: likes, improve: imp, message: p.message, time: new Date().toISOString() }); lsSet(K_MINE, mine.slice(0, 50)); lsSet(K_NAME, name);
    busy = true; var btn = q("#ffSend"); btn.disabled = true; btn.textContent = "Sending…";
    var done = function (note) { box.innerHTML = '<div class="ffDone"><div style="color:var(--accent)">' + paw(54) + '</div><h2>Thank you, ' + esc(name) + '!</h2><p class="fwNote">' + esc(note) + '</p><div class="fwFoot"><button class="ffBtn" type="button" data-a="wall">See all feedback</button><button class="ffBtn ghost" type="button" data-a="close">Close</button></div></div>'; };
    try { window.dispatchEvent(new CustomEvent("vetnet:name", { detail: name })); } catch (er) {}
    if (!API()) { done("Saved on this device. The shared wall is not connected yet, so only you can see it."); return; }
    post(p).then(function (j) {
      if (j && j.ok) { remote = []; lsSet(K_CACHE, []); done("Your feedback is now on the wall for everyone to see."); }
      else { q("#ffEG").textContent = (j && j.error === "kind") ? KIND : (j && j.error === "reserved") ? RES : "Please check your name and rating."; busy = false; btn.disabled = false; btn.textContent = "Send feedback"; }
    }).catch(function () { var qq = lsGet(K_Q, []); qq.push(p); lsSet(K_Q, qq); done("You seem to be offline. Your feedback is saved and will be sent when you are back online."); });
  }

  /* ---------- likes + comments ---------- */
  function toggleLike(id) {
    var x = find(id); if (!x) return; var i = liked.indexOf(id), want = i < 0;
    if (want) { liked.push(id); x.hearts++; } else { liked.splice(i, 1); x.hearts = Math.max(0, x.hearts - 1); }
    lsSet(K_LIKED, liked); render();
    post({ action: "like", fid: id, cid: cid(), on: want }).then(function (j) { if (!j || !j.ok) throw 0; }).catch(function () {
      var k = liked.indexOf(id); if (want) { if (k > -1) liked.splice(k, 1); x.hearts = Math.max(0, x.hearts - 1); } else { if (k < 0) liked.push(id); x.hearts++; } lsSet(K_LIKED, liked); render();
    });
  }
  function sendComment(id) {
    var x = find(id); if (!x) return; var txt = (drafts[id] || "").replace(/\s+/g, " ").trim(), nm = userName() || (drafts["nm-" + id] || "").replace(/\s+/g, " ").trim();
    if (nm.length < 2) { cmErr[id] = "Please enter your name (at least 2 letters)."; render(); return; }
    if (!txt) { cmErr[id] = "Please write something first."; render(); return; }
    if (rude(nm)) { cmErr[id] = "Please use a respectful name."; render(); return; }
    if (reserved(nm)) { cmErr[id] = RES; render(); return; }
    if (rude(txt)) { cmErr[id] = KIND; render(); return; }
    var rt = replyTo[id], c = { id: uid(), parent: rt ? rt.c : "", name: nm, text: txt.slice(0, 1000), time: new Date().toISOString() };
    lsSet(K_NAME, nm); try { window.dispatchEvent(new CustomEvent("vetnet:name", { detail: nm })); } catch (er) {}
    x.comments.push(c); drafts[id] = ""; delete replyTo[id]; cmErr[id] = ""; render();
    post({ action: "comment", fid: id, id: c.id, parent: c.parent, name: nm, text: c.text }).then(function (j) { if (!j || !j.ok) throw j || 0; }).catch(function (er) {
      x.comments = x.comments.filter(function (y) { return y.id !== c.id; }); drafts[id] = txt; cmErr[id] = (er && er.error === "kind") ? KIND : (er && er.error === "reserved") ? RES : "Could not send your comment. Please check your internet."; render();
    });
  }

  /* ---------- actions + hooks ---------- */
  function act(a, b) {
    var id = b.dataset.id;
    if (a === "close") close(); else if (a === "wall") openWall(); else if (a === "add") openForm(); else if (a === "retry") load();
    else if (a === "more") { shown += 15; render(); }
    else if (a === "f") { filter = +b.dataset.f; shown = 15; render(); }
    else if (a === "rate") setRating(+b.dataset.r);
    else if (a === "chip") { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); syncSpecify(); }
    else if (a === "like") toggleLike(id);
    else if (a === "cm") { open[id] = !open[id]; render(); }
    else if (a === "reply") { replyTo[id] = { c: b.dataset.c, n: b.dataset.n }; render(); var t = box.querySelector('[data-draft="' + id + '"]'); t && t.focus(); }
    else if (a === "unreply") { delete replyTo[id]; render(); }
    else if (a === "sendcm") sendComment(id);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fb]"); if (!b || b.closest(".fwOv")) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (b.closest(".fbinv")) { var inv = document.getElementById("fbInvite"); inv && inv.remove(); openForm(); } else openWall();
  }, true);
  window.addEventListener("online", flush); setTimeout(flush, 2500);
  window.VetNetFeedback = { openWall: openWall, openForm: openForm };
})();