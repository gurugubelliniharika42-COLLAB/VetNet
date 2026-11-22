/* VetNet: "Watch the class" box at the end of every topic. English videos, Telugu through YouTube's auto-translate captions. */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var CC = "&sp=EgIoAQ%253D%253D"; /* YouTube filter: only videos that have subtitles/CC (needed for Telugu translation) */
  function topicId() { var m = location.hash.match(/^#reader\/(.+)$/); return m ? decodeURIComponent(m[1]) : ""; }
  function build(box) {
    var body = box.querySelector(".body"), h1 = box.querySelector("h1");
    if (!body || !h1 || box.querySelector(".vidBox")) return;
    var id = topicId(), title = h1.textContent.trim();
    var crumbs = box.querySelectorAll(".crumbs a"), subj = crumbs.length ? crumbs[crumbs.length - 1].textContent.trim() : "";
    var q = encodeURIComponent((title + " " + subj + " veterinary lecture").replace(/\s+/g, " "));
    var list = ((window.VETNET_VIDEOS || {})[id] || []).filter(function (v) { return v && /^[\w-]{11}$/.test(v.id || ""); });
    var d = document.createElement("section"); d.className = "vidBox no-focus"; d.setAttribute("aria-label", "Video classes");
    var h = "<h2>Watch the class</h2><p class=\"vidSub\">English lectures, with Telugu subtitles on request</p>";
    if (list.length) h += '<div class="vidList">' + list.map(function (v) { return '<a class="vidCard" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=' + v.id + '"><span class="vidPlay" aria-hidden="true">&#9654;</span><span><b>' + esc(v.title || "Recommended video") + '</b><small>Opens on YouTube</small></span></a>'; }).join("") + "</div>";
    h += '<div class="vidActs"><a class="btn" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/results?search_query=' + q + CC + '">Find English classes on this topic</a></div>';
    h += '<details class="vidTe"><summary>How to watch in Telugu</summary><ol><li>Open an English video that shows the <b>CC</b> icon.</li><li>Tap <b>Settings (gear)</b> &rarr; <b>Subtitles/CC</b> &rarr; <b>Auto-translate</b>.</li><li>Choose <b>Telugu</b>.</li></ol><p>Auto-translate only works if the video owner left captions on, and the Telugu is machine-made, so check key terms in your notes.</p></details>';
    h += '<p class="vidNote">Videos are made by other teachers on YouTube. VetNet does not own them and cannot check every detail, so verify with your textbook.</p>';
    d.innerHTML = h; body.insertAdjacentElement("afterend", d);
  }
  function run() { var r = document.getElementById("reader"); if (r) build(r); }
  var r0 = document.getElementById("reader");
  if (r0) new MutationObserver(function () { run(); }).observe(r0, { childList: true });
  window.addEventListener("hashchange", function () { setTimeout(run, 50); });
  run();
})();