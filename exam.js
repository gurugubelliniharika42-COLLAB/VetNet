/* VetNet Mock Test: timed practice tests, results by topic, and a "My mistakes" list.
   Add-on file. It reads your existing MCQs; it does not change script.js. */
(function () {
  "use strict";
  var K_RUN = "vetnet_mock_run", K_MIS = "vetnet_mock_mistakes", K_HIS = "vetnet_mock_history", K_TOP = "vetnet_mock_topics";
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hash(s) { var h = 5381, i; s = String(s); for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }
  var root, run = null, tick = null, bank = null, byId = null;

  /* ---------- question bank (built from your existing MCQs) ---------- */
  function build() {
    if (bank) return;
    bank = []; byId = {};
    TOPICS.forEach(function (t) {
      if (!t.q) return;
      t.q.forEach(function (m) {
        var q = { id: t.id + ":" + hash(m[0]), q: m[0], o: m[1], a: m[2], e: m[3], t: t.id, s: t.s };
        bank.push(q); byId[q.id] = q;
      });
    });
  }
  function subjName(id) { return SUBJ[id] ? SUBJ[id].name : id; }
  function topicName(id) { return T[id] ? T[id].t : id; }
  function mistakes() { var m = lsGet(K_MIS, []); return m.filter(function (id) { return byId[id]; }); }
  function addMistake(id) { var m = lsGet(K_MIS, []); if (m.indexOf(id) < 0) { m.unshift(id); lsSet(K_MIS, m.slice(0, 500)); } }
  function clearMistake(id) { var m = lsGet(K_MIS, []), i = m.indexOf(id); if (i > -1) { m.splice(i, 1); lsSet(K_MIS, m); } }

  /* ---------- page shell ---------- */
  function mount() {
    var main = document.getElementById("main"); if (!main || document.getElementById("page-mock")) return;
    var sec = document.createElement("section"); sec.className = "page"; sec.id = "page-mock";
    sec.innerHTML = '<h1>Mock Test</h1><p class="meta">Timed practice tests from the VetNet MCQs. They are practice questions, not previous-year university papers.</p><div id="mkBody"></div>';
    main.appendChild(sec); root = sec.querySelector("#mkBody");
    var nav = document.getElementById("nav");
    if (nav && !nav.querySelector('a[href="#mock"]')) {
      var a = document.createElement("a"); a.href = "#mock"; a.textContent = "Mock Test";
      var q = nav.querySelector('a[href="#quiz"]'); if (q && q.nextSibling) nav.insertBefore(a, q.nextSibling); else nav.appendChild(a);
    }
    var cta = document.querySelector("#page-home .cta");
    if (cta && !cta.querySelector('a[href="#mock"]')) {
      var b = document.createElement("a"); b.className = "btn ghost"; b.href = "#mock"; b.textContent = "Take a Mock Test";
      var pq = cta.querySelector('a[href="#quiz"]'); if (pq && pq.nextSibling) cta.insertBefore(b, pq.nextSibling); else cta.appendChild(b);
    }
    root.addEventListener("click", onClick); root.addEventListener("change", onChange);
    document.addEventListener("keydown", onKey);
    if (typeof routes === "object") { routes.mock = renderMock; var oh = routes.home; routes.home = function (a) { oh(a); try { drawWeak(); } catch (e) {} }; }
    window.addEventListener("hashchange", function () { if (location.hash.indexOf("#mock") !== 0) stopTick(); });
  }

  /* ---------- setup screen ---------- */
  function renderMock(arg) {
    build();
    var saved = lsGet(K_RUN, null);
    if (saved && saved.ids && saved.ids.length && !saved.done) { run = saved; if (run.end && Date.now() >= run.end) { finish(true); return; } view(); startTick(); return; }
    run = null; if (arg && T[arg] && byId) setup({ s: T[arg].s, t: arg }); else setup();
  }
  function setup(pref) {
    pref = pref || {};
    var subs = SUBJECTS.filter(function (s) { return bank.some(function (q) { return q.s === s.id; }); });
    var mis = mistakes().length, hist = lsGet(K_HIS, []).slice(0, 6);
    root.innerHTML =
      '<div class="card mkSet"><h2>Set up your test</h2>' +
      '<label for="mkSubj">Subject</label><select id="mkSubj"><option value="">All subjects (' + bank.length + ' questions)</option>' + subs.map(function (s) { var n = bank.filter(function (q) { return q.s === s.id; }).length; return '<option value="' + s.id + '"' + (pref.s === s.id ? " selected" : "") + ">" + esc(s.name) + " (" + n + ")</option>"; }).join("") + "</select>" +
      '<label for="mkTopic">Topic</label><select id="mkTopic"><option value="">All topics</option></select>' +
      '<div class="mkTwo"><div><label for="mkNum">Questions</label><select id="mkNum">' + [10, 20, 30, 50].map(function (n) { return '<option value="' + n + '"' + (n === 20 ? " selected" : "") + ">" + n + "</option>"; }).join("") + '</select></div>' +
      '<div><label for="mkTime">Time limit</label><select id="mkTime"><option value="auto" selected>1 minute per question</option><option value="0">No timer</option><option value="10">10 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></div></div>' +
      '<label for="mkMode">When do you see answers?</label><select id="mkMode"><option value="end" selected>After I finish (exam style)</option><option value="each">After each question (practice style)</option></select>' +
      '<p class="mkAvail meta" id="mkAvail"></p><div class="row"><button class="btn" id="mkStart" type="button">Start test</button>' +
      (mis ? '<button class="btn ghost" id="mkMis" type="button">Practise my mistakes (' + mis + ")</button>" : "") + '</div><p class="err" id="mkErr" role="alert"></p></div>' +
      (hist.length ? '<div class="card mkHist"><h3>Your recent tests</h3><ul class="list">' + hist.map(function (h) { return "<li><span><b>" + h.score + " / " + h.total + "</b> (" + h.pct + "%) · " + esc(h.label) + '</span><span class="meta">' + new Date(h.at).toLocaleDateString(undefined, { day: "numeric", month: "short" }) + "</span></li>"; }).join("") + '</ul><button class="btn ghost small" id="mkClearHist" type="button">Clear history</button></div>' : "") +
      (mis ? '<div class="card"><h3>My mistakes</h3><p class="meta">Questions you got wrong. Answer them right once in a test and they leave this list.</p><button class="btn ghost small" id="mkMisList" type="button">Show the list</button><div id="mkMisBox"></div></div>' : "");
    fillTopics(); if (pref.t) { var te = root.querySelector("#mkTopic"); if (te) te.value = pref.t; } avail();
  }
  function fillTopics() {
    var sid = $v("#mkSubj"), el = root.querySelector("#mkTopic"); if (!el) return;
    var ids = {}; bank.forEach(function (q) { if (!sid || q.s === sid) ids[q.t] = (ids[q.t] || 0) + 1; });
    var list = (sid && ORDER[sid] ? ORDER[sid] : Object.keys(ids)).filter(function (id) { return ids[id]; });
    el.innerHTML = '<option value="">All topics' + (sid ? " in this subject" : "") + "</option>" + (sid ? list.map(function (id) { return '<option value="' + id + '">' + esc(topicName(id)) + " (" + ids[id] + ")</option>"; }).join("") : "");
    el.disabled = !sid;
  }
  function $v(sel) { var e = root.querySelector(sel); return e ? e.value : ""; }
  function pool() { var s = $v("#mkSubj"), t = $v("#mkTopic"); return bank.filter(function (q) { return (!s || q.s === s) && (!t || q.t === t); }); }
  function avail() { var n = pool().length, e = root.querySelector("#mkAvail"); if (e) e.textContent = n + " questions available for this choice."; }

  /* ---------- starting a test ---------- */
  function begin(list, label, timeSel, mode) {
    var num = +$v("#mkNum") || 20; if (list.length > num) list = list.slice(0, num);
    if (!list.length) { var er = root.querySelector("#mkErr"); if (er) er.textContent = "No questions for that choice yet."; return; }
    var mins = timeSel === "auto" ? Math.ceil(list.length) : +timeSel;
    run = { ids: list.map(function (q) { return q.id; }), order: list.map(function (q) { return shuf(q.o.map(function (_, i) { return i; })); }), ans: {}, flag: {}, i: 0, start: Date.now(), end: mins ? Date.now() + mins * 60000 : 0, mins: mins, mode: mode, label: label, shown: {} };
    save(); view(); startTick();
  }
  function save() { lsSet(K_RUN, run); }

  /* ---------- test screen ---------- */
  function view() {
    if (run.done) { result(); return; }
    var id = run.ids[run.i], q = byId[id], ord = run.order[run.i], chosen = run.ans[id], reveal = run.mode === "each" && chosen !== undefined;
    var nav = run.ids.map(function (qid, k) { var c = (run.ans[qid] !== undefined ? " done" : "") + (run.flag[qid] ? " flag" : "") + (k === run.i ? " cur" : ""); return '<button type="button" class="mkDot' + c + '" data-go="' + k + '" aria-label="Question ' + (k + 1) + (run.ans[qid] !== undefined ? ", answered" : "") + (run.flag[qid] ? ", flagged" : "") + '">' + (k + 1) + "</button>"; }).join("");
    var answered = Object.keys(run.ans).length;
    root.innerHTML =
      '<div class="mkBar card"><div><b>Question ' + (run.i + 1) + " of " + run.ids.length + '</b><span class="meta"> · ' + esc(subjName(q.s)) + " · " + answered + " answered</span></div>" +
      (run.end ? '<div class="mkClock" id="mkClock" role="timer" aria-label="Time left">' + fmt((run.end - Date.now()) / 1000) + "</div>" : '<div class="meta">No timer</div>') + "</div>" +
      '<div class="card mkQ"><h2>' + esc(q.q) + '</h2><div class="opts">' +
      ord.map(function (oi, k) {
        var cls = "opt" + (chosen === oi ? " picked" : "");
        if (reveal) { if (oi === q.a) cls += " right"; else if (chosen === oi) cls += " wrong"; }
        return '<button type="button" class="' + cls + '" data-opt="' + oi + '"' + (reveal ? " disabled" : "") + '><span class="mkKey">' + (k + 1) + "</span>" + esc(q.o[oi]) + "</button>";
      }).join("") + "</div>" +
      (reveal ? '<p class="exp"><b>' + (chosen === q.a ? "Correct." : "Not quite.") + "</b> " + esc(q.e) + ' <a href="#reader/' + q.t + '">Read the topic</a></p>' : "") +
      '<div class="row mkCtl"><button class="btn ghost" type="button" data-nav="-1"' + (run.i === 0 ? " disabled" : "") + '>Previous</button>' +
      '<button class="btn ghost" type="button" data-flag="1">' + (run.flag[id] ? "Unflag" : "Flag for review") + "</button>" +
      (run.i < run.ids.length - 1 ? '<button class="btn" type="button" data-nav="1">Next</button>' : '<button class="btn" type="button" data-submit="1">Finish test</button>') + "</div></div>" +
      '<div class="card"><p class="meta">Jump to a question. Keys: 1 to 4 pick an answer, arrow keys move.</p><div class="mkDots">' + nav + '</div><div class="row"><button class="btn ghost small" type="button" data-submit="1">Submit test</button><button class="btn ghost small" type="button" data-quit="1">Quit without saving</button></div></div>';
  }
  function startTick() {
    stopTick(); if (!run || !run.end) return;
    tick = setInterval(function () {
      if (!run || run.done) { stopTick(); return; }
      var left = (run.end - Date.now()) / 1000, el = document.getElementById("mkClock");
      if (el) { el.textContent = fmt(left); el.classList.toggle("low", left <= 60); }
      if (left <= 0) { stopTick(); finish(true); }
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  /* ---------- finishing ---------- */
  function finish(timeUp) {
    if (!run) return; stopTick();
    var score = 0, skipped = 0, by = {};
    run.ids.forEach(function (id) {
      var q = byId[id], a = run.ans[id], ok = a === q.a;
      var tb = by[q.t] || (by[q.t] = { n: 0, ok: 0 }); tb.n++;
      if (a === undefined) skipped++; else if (ok) { score++; tb.ok++; clearMistake(id); } else addMistake(id);
    });
    var tp = lsGet(K_TOP, {}); Object.keys(by).forEach(function (t) { var o = tp[t] || { n: 0, ok: 0 }; o.n += by[t].n; o.ok += by[t].ok; tp[t] = o; }); lsSet(K_TOP, tp);
    run.done = true; run.timeUp = !!timeUp; run.score = score; run.skipped = skipped; run.by = by; run.took = Math.round(((run.end && Date.now() > run.end ? run.end : Date.now()) - run.start) / 1000);
    var h = lsGet(K_HIS, []); h.unshift({ at: Date.now(), score: score, total: run.ids.length, pct: Math.round(score / run.ids.length * 100), label: run.label }); lsSet(K_HIS, h.slice(0, 30));
    lsDel(K_RUN); result();
  }
  function result() {
    var n = run.ids.length, pct = Math.round(run.score / n * 100), wrong = run.ids.filter(function (id) { return run.ans[id] !== undefined && run.ans[id] !== byId[id].a; });
    var rows = Object.keys(run.by).map(function (t) { var b = run.by[t]; return { t: t, n: b.n, ok: b.ok, p: Math.round(b.ok / b.n * 100) }; }).sort(function (a, b) { return a.p - b.p; });
    var msg = pct >= 80 ? "Strong result. Keep revising the weak topics below." : pct >= 50 ? "Decent start. The topics at the top of the list need the most revision." : "Don't worry. Read the topics below, then try again.";
    root.innerHTML =
      '<div class="card mkRes"><h2>Your result</h2><p class="mkScore"><b>' + run.score + " / " + n + "</b> <span>" + pct + "%</span></p><p class=\"meta\">" + (run.timeUp ? "Time was up. " : "") + run.skipped + " skipped · " + wrong.length + " wrong · took " + fmt(run.took) + "</p><p>" + msg + "</p>" +
      '<div class="row"><button class="btn" type="button" id="mkNew">New test</button>' + (wrong.length ? '<button class="btn ghost" type="button" id="mkRetry">Retry the ' + wrong.length + " I got wrong</button>" : "") + "</div></div>" +
      '<div class="card"><h3>By topic</h3><p class="meta">Weakest first.</p><ul class="mkTopics">' + rows.map(function (r) { return '<li><div class="mkTn"><a href="#reader/' + r.t + '">' + esc(topicName(r.t)) + '</a><span class="meta">' + r.ok + " / " + r.n + '</span></div><div class="mkBarT" role="img" aria-label="' + r.p + ' percent"><i style="width:' + r.p + '%"></i></div></li>'; }).join("") + "</ul></div>" +
      '<div class="card"><h3>Review every question</h3>' + run.ids.map(function (id, k) {
        var q = byId[id], a = run.ans[id], st = a === undefined ? "skip" : a === q.a ? "ok" : "bad";
        return '<details class="mkRev ' + st + '"' + (st === "bad" ? " open" : "") + "><summary>" + (k + 1) + ". " + esc(q.q) + '<span class="mkTag">' + (st === "ok" ? "Correct" : st === "bad" ? "Wrong" : "Skipped") + '</span></summary><p><b>Correct answer:</b> ' + esc(q.o[q.a]) + "</p>" + (st === "bad" ? "<p><b>You chose:</b> " + esc(q.o[a]) + "</p>" : "") + '<p class="exp">' + esc(q.e) + ' <a href="#reader/' + q.t + '">Read the topic</a></p></details>';
      }).join("") + "</div>";
    window.scrollTo(0, 0);
  }

  /* ---------- events ---------- */
  function onChange(e) { if (e.target.id === "mkSubj") { fillTopics(); avail(); } else if (e.target.id === "mkTopic") avail(); }
  function onClick(e) {
    var b = e.target.closest("button"); if (!b) return; var id = b.id;
    if (id === "mkStart") { var s = $v("#mkSubj"), t = $v("#mkTopic"); begin(shuf(pool()), (t ? topicName(t) : s ? subjName(s) : "All subjects"), $v("#mkTime"), $v("#mkMode")); }
    else if (id === "mkMis") { var ms = mistakes().map(function (i) { return byId[i]; }); begin(shuf(ms), "My mistakes", $v("#mkTime"), $v("#mkMode")); }
    else if (id === "mkMisList") { root.querySelector("#mkMisBox").innerHTML = '<ul class="list">' + mistakes().slice(0, 100).map(function (i) { var q = byId[i]; return "<li><span>" + esc(q.q) + '</span><span class="meta">' + esc(topicName(q.t)) + "</span></li>"; }).join("") + "</ul>"; b.hidden = true; }
    else if (id === "mkClearHist") { lsDel(K_HIS); setup(); }
    else if (id === "mkNew") { run = null; setup(); }
    else if (id === "mkRetry") { var w = run.ids.filter(function (i) { return run.ans[i] !== undefined && run.ans[i] !== byId[i].a; }).map(function (i) { return byId[i]; }); run = null; setup(); begin(shuf(w), "Retry wrong", "auto", "each"); }
    else if (run && !run.done) {
      if (b.dataset.opt !== undefined) pick(+b.dataset.opt);
      else if (b.dataset.nav) go(run.i + +b.dataset.nav);
      else if (b.dataset.go !== undefined) go(+b.dataset.go);
      else if (b.dataset.flag) { var q = run.ids[run.i]; run.flag[q] = !run.flag[q]; save(); view(); }
      else if (b.dataset.submit) { var left = run.ids.length - Object.keys(run.ans).length; if (!left || confirm(left + " question(s) are not answered. Submit anyway?")) finish(false); }
      else if (b.dataset.quit) { if (confirm("Quit this test? Your answers will not be saved.")) { stopTick(); lsDel(K_RUN); run = null; setup(); } }
    }
  }
  function pick(oi) { var id = run.ids[run.i]; if (run.mode === "each" && run.ans[id] !== undefined) return; run.ans[id] = oi; save(); view(); if (run.mode === "end" && run.i < run.ids.length - 1) { /* stay so the learner can change the answer */ } }
  function go(k) { if (k < 0 || k >= run.ids.length) return; run.i = k; save(); view(); window.scrollTo(0, 0); }
  function onKey(e) {
    if (!run || run.done || !root || !root.isConnected || !document.getElementById("page-mock").classList.contains("active")) return;
    var tg = e.target.tagName; if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT") return;
    if (e.key >= "1" && e.key <= "9") { var ord = run.order[run.i], k = +e.key - 1; if (ord[k] !== undefined) pick(ord[k]); }
    else if (e.key === "ArrowRight") go(run.i + 1); else if (e.key === "ArrowLeft") go(run.i - 1);
  }

  /* ---------- "Revise next" card on the home page ---------- */
  function drawWeak() {
    var grid = document.querySelector("#page-home .grid.dash"); if (!grid) return;
    var card = document.getElementById("hWeak");
    if (!card) { card = document.createElement("article"); card.className = "card"; card.id = "hWeak"; var second = grid.children[1]; if (second) grid.insertBefore(card, second); else grid.appendChild(card); }
    var tp = lsGet(K_TOP, {}), hist = lsGet(K_HIS, []), mis = mistakes().length;
    var weak = Object.keys(tp).filter(function (t) { return T[t] && tp[t].n >= 2 && tp[t].ok / tp[t].n < 0.8; }).map(function (t) { return { t: t, p: Math.round(tp[t].ok / tp[t].n * 100), n: tp[t].n }; }).sort(function (a, b) { return a.p - b.p; }).slice(0, 5);
    var h = "<h2>Revise Next</h2>";
    if (!hist.length) h += '<p class="empty">Take a mock test and VetNet will show the topics that need more revision.</p><a class="btn small" href="#mock">Take a Mock Test</a>';
    else {
      var avg = Math.round(hist.slice(0, 5).reduce(function (a, x) { return a + x.pct; }, 0) / Math.min(5, hist.length));
      h += '<p class="meta">Last ' + Math.min(5, hist.length) + " test(s): average <b>" + avg + "%</b></p>";
      h += weak.length ? '<ul class="list">' + weak.map(function (w) { return "<li><a href=\"#reader/" + w.t + '">' + esc(topicName(w.t)) + '</a><span class="meta">' + w.p + '% right</span></li>'; }).join("") + "</ul>" : '<p class="empty">No weak topics so far. Keep testing.</p>';
      h += '<div class="row"><a class="btn small" href="#mock">New test</a>' + (weak.length ? '<a class="btn small ghost" href="#mock/' + weak[0].t + '">Practise ' + esc(cut(topicName(weak[0].t), 22)) + "</a>" : "") + (mis ? '<span class="meta">' + mis + " in My mistakes</span>" : "") + "</div>";
    }
    card.innerHTML = h;
  }
  function cut(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "\u2026" : s; }

  /* ---------- feed wrong answers from the normal MCQ Quiz page into "My mistakes" ---------- */
  function watchQuiz() {
    var play = document.getElementById("qzPlay"); if (!play || typeof MutationObserver === "undefined") return;
    new MutationObserver(function () {
      try {
        var fb = document.getElementById("qzFb"); if (!fb || !fb.querySelector(".exp") || fb.dataset.mk) return; fb.dataset.mk = "1";
        var q = Q.pool[Q.i]; if (!q) return; var id = q.t + ":" + hash(q.q); if (!byId[id]) return;
        if (play.querySelector(".opt.wrong")) addMistake(id); else clearMistake(id);
      } catch (e) {}
    }).observe(play, { childList: true, subtree: true });
  }

  function init() { build(); mount(); watchQuiz(); try { drawWeak(); } catch (e) {} if (location.hash.indexOf("#mock") === 0 && typeof route === "function") route(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();