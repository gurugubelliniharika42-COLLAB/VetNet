/* VetNet: offline use and "Install app" button (add-on). Needs https or localhost. */
(function () {
  "use strict";
  function toast(msg, ms) {
    var t = document.createElement("div"); t.className = "pwaToast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, ms || 4500);
  }
  var st = document.createElement("style"); st.textContent = ".pwaToast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;transition:.3s;background:var(--ink);color:var(--card);padding:11px 18px;border-radius:12px;font:600 .88rem var(--f-ui,inherit);z-index:9500;max-width:calc(100vw - 28px);text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.25)} .pwaToast.show{opacity:1;transform:translate(-50%,0)} .pwaOff{position:fixed;left:0;right:0;bottom:0;z-index:9400;background:var(--ink);color:var(--card);font:600 .82rem var(--f-ui,inherit);padding:9px 14px;text-align:center} .pwaInstall{font:700 .8rem var(--f-ui,inherit);padding:0 12px;width:auto} @media (prefers-reduced-motion:reduce){.pwaToast{transition:none}}"; document.head.appendChild(st);
  var bar = null;
  function offlineBar(on) {
    if (on && !bar) { bar = document.createElement("div"); bar.className = "pwaOff"; bar.textContent = "You are offline. Notes, MCQs and diagrams still work. Feedback needs internet."; document.body.appendChild(bar); }
    else if (!on && bar) { bar.remove(); bar = null; }
  }
  window.addEventListener("offline", function () { offlineBar(true); });
  window.addEventListener("online", function () { offlineBar(false); });
  if (!navigator.onLine) offlineBar(true);

  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    var top = document.querySelector(".topbar"), th = document.getElementById("themeBtn");
    if (!top || document.getElementById("pwaInstall")) return;
    var b = document.createElement("button"); b.id = "pwaInstall"; b.type = "button"; b.className = "iconbtn pwaInstall"; b.textContent = "Install app";
    b.addEventListener("click", function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { deferred = null; b.remove(); }); });
    top.insertBefore(b, th || null);
  });
  window.addEventListener("appinstalled", function () { var b = document.getElementById("pwaInstall"); if (b) b.remove(); toast("VetNet installed."); });

  if (!("serviceWorker" in navigator)) return;
  var okHost = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!okHost) return;
  window.addEventListener("load", function () {
    var first = !navigator.serviceWorker.controller;
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      reg.addEventListener("updatefound", function () {
        var w = reg.installing; if (!w) return;
        w.addEventListener("statechange", function () { if (w.state === "activated" && first) toast("Saved for offline use. VetNet now opens without internet."); });
      });
    }).catch(function () {});
  });
})();