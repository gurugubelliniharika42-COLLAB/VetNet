/* VetNet welcome: asks your name once, then greets you on the home page. Name stays on this device. */
(function () {
  "use strict";
  var K = "vetnet_user_name", KA = "vetnet_user_asked";
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clean(s) { return String(s || "").replace(/\s+/g, " ").trim().slice(0, 30); }
  /* wishes by time of day: [until hour, emoji, "Good ...", handwritten line, small emoji] */
  var MOODS = [
    [5, "\uD83C\uDF19", "Good night", "Still up? Be gentle with your eyes", "\uD83D\uDC40"],
    [12, "\u2600\uFE0F", "Good morning", "Fresh mind, best time to study", "\uD83D\uDCDA"],
    [17, "\uD83C\uDF24\uFE0F", "Good afternoon", "Let's learn something new today", "\u2728"],
    [21, "\uD83C\uDF06", "Good evening", "A calm study hour awaits", "\uD83C\uDF3F"],
    [24, "\uD83C\uDF19", "Good night", "A little revision before rest", "\uD83D\uDCA4"]
  ];
  function mood() { var h = new Date().getHours(); for (var i = 0; i < MOODS.length; i++) if (h < MOODS[i][0]) return MOODS[i]; return MOODS[4]; }
  var PETS = ["🐾", "🐮", "🐕", "🐴", "🐑", "🐓"];

  function greet() {
    var hero = document.querySelector("#page-home .hero"); if (!hero) return;
    var old = document.getElementById("heyBox"); if (old) old.remove();
    var n = get(K), m = mood(), pet = PETS[new Date().getDate() % PETS.length], d = document.createElement("div"); d.id = "heyBox"; d.className = "heyBox";
    var head = '<p class="heyHi"><span class="heyWave" aria-hidden="true">' + m[1] + "</span> " + esc(m[2]) + (n ? ', <span class="heyName">' + esc(n) + "</span>" : "") + '! <span aria-hidden="true">' + pet + "</span></p>";
    d.innerHTML = head + '<p class="heySub">' + esc(m[3]) + ' <span aria-hidden="true">' + m[4] + '</span></p><button class="heyChg" type="button" id="heyChg">' + (n ? "Not you? Change name" : "Tell us your name") + "</button>";
    hero.insertBefore(d, hero.firstChild);
    d.querySelector("#heyChg").addEventListener("click", function () { ask(true); });
  }
  var ov;
  function ask(again) {
    if (ov) ov.remove(); var cur = get(K) || "";
    ov = document.createElement("div"); ov.className = "heyOv"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-labelledby", "heyT");
    ov.innerHTML = '<div class="heyCard"><div class="heyBig" aria-hidden="true">👋🐾</div><h2 id="heyT">' + (again ? "What should we call you?" : "Hey there! Welcome to VetNet") + '</h2><p class="heyP">' + (again ? "Your name stays on this device." : "What should we call you? Your name stays on this device, and is shown only if you give feedback or comment.") + '</p>' +
      '<label class="heyL" for="heyIn">Your name</label><input id="heyIn" class="heyIn" maxlength="30" autocomplete="given-name" placeholder="Like: Anitha" value="' + esc(cur) + '"><p class="heyErr" id="heyErr"></p>' +
      '<div class="heyActs"><button class="heyBtn" type="button" id="heyGo">Continue ✨</button><button class="heySkip" type="button" id="heySkip">' + (again ? "Cancel" : "Skip for now") + "</button></div></div>";
    document.body.appendChild(ov); requestAnimationFrame(function () { ov.classList.add("on"); });
    var inp = ov.querySelector("#heyIn"); inp.focus(); inp.select();
    function done() { ov.classList.remove("on"); var o = ov; ov = null; setTimeout(function () { o.remove(); }, 350); }
    function go() { var v = clean(inp.value); if (window.VETNET_SAFE && window.VETNET_SAFE.bad(v)) { ov.querySelector("#heyErr").textContent = "Please use a respectful name."; inp.focus(); return; } if (window.VETNET_SAFE && window.VETNET_SAFE.reserved(v)) { ov.querySelector("#heyErr").textContent = "That name is reserved for the VetNet team. Please use your own name."; inp.focus(); return; } if (v.length < 1) { ov.querySelector("#heyErr").textContent = "Please type your name, or skip."; inp.focus(); return; } set(K, v); set(KA, 1); done(); greet(); try { window.dispatchEvent(new CustomEvent("vetnet:name", { detail: v })); } catch (e) {} }
    ov.querySelector("#heyGo").addEventListener("click", go);
    ov.querySelector("#heySkip").addEventListener("click", function () { set(KA, 1); done(); greet(); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); if (e.key === "Escape") { set(KA, 1); done(); greet(); } });
  }
  function init() { greet(); setInterval(function () { if (!ov) greet(); }, 60000); if (!get(K) && !get(KA)) setTimeout(function () { ask(false); }, 700); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();