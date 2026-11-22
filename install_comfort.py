"""VetNet comfort add-on installer. Run inside your VetNet folder:  python install_comfort.py
Creates comfort-boot.js, comfort.css, comfort.js, feedback-wall.js, feedback-data.js and patches index.html
(backup saved as index.html.bak). Safe to run twice (it will not touch feedback-data.js if it already has your entries)."""
import os, sys, shutil
FILES = {}
FILES['comfort-boot.js'] = r'''/* VetNet comfort: runs in <head> BEFORE the page paints, so there is no flash. */
(function () {
  try {
    var s = JSON.parse(localStorage.getItem("vetnet_comfort_v1") || "{}");
    var t = ({ paper: "comfort", amber: "dark", night: "dark" })[s.theme] || s.theme || "comfort";
    if (t === "auto") { var h = new Date().getHours(); t = h >= 7 && h < 18 ? "comfort" : "dark"; }
    var d = document.documentElement;
    d.setAttribute("data-ct", t);
    d.style.setProperty("--tsz", ((s.tsz || 100) / 100));
    d.style.setProperty("--clh", ({ snug: 1.6, relaxed: 1.8, airy: 2.05 })[s.lh || "relaxed"]);
    d.style.setProperty("--cls", ({ normal: "0em", wide: ".02em", wider: ".045em" })[s.ls || "normal"]);
    if (s.rm) d.setAttribute("data-rm", "1");
  } catch (e) { document.documentElement.setAttribute("data-ct", "comfort"); }
})();
'''
FILES['comfort.css'] = r'''/* VetNet comfort layer. Three modes: Light, Eye comfort (soft sage), Dark. Fonts in /fonts (works offline). */
@import url("https://fonts.googleapis.com/css2?family=Young+Serif&family=DM+Sans:wght@400;500;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Caveat:wght@700&display=swap");
@font-face{font-family:"Young Serif";font-weight:400;font-display:swap;src:url(fonts/young-serif.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:400;font-display:swap;src:url(fonts/dmsans-400.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:500;font-display:swap;src:url(fonts/dmsans-500.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:700;font-display:swap;src:url(fonts/dmsans-700.woff2) format("woff2")}
@font-face{font-family:"Source Serif 4";font-weight:400;font-style:normal;font-display:swap;src:url(fonts/source-serif-400.woff2) format("woff2")}
@font-face{font-family:"Source Serif 4";font-weight:400;font-style:italic;font-display:swap;src:url(fonts/source-serif-400i.woff2) format("woff2")}
@font-face{font-family:"Source Serif 4";font-weight:600;font-style:normal;font-display:swap;src:url(fonts/source-serif-600.woff2) format("woff2")}
@font-face{font-family:"Caveat";font-weight:700;font-display:swap;src:url(fonts/caveat-700.woff2) format("woff2")}

html{--f-head:"Young Serif",Georgia,serif;--f-ui:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;--f-read:"Source Serif 4",Georgia,serif;--f-hand:"Caveat","Segoe Script",cursive}

/* ---- the three modes. --edge = darker lip under raised things, --hi = top highlight, --sh = shadow tint ---- */
html[data-ct="light"] body{--bg:#e9ece6;--cream:#e9ece6;--card:#f6f7f3;--mint:#dfe5dc;--ink:#1d2622;--muted:#56635b;--line:#c9d0c7;--accent:#2c6b52;--accent-ink:#f4f8f5;--forest:#2c6b52;--sage:#6f9783;--warnbg:#efe3b4;--warnink:#4a3b00;--good:#1f6a3f;--bad:#a1352c;--hl:#f0e2a0;--diabg:#fbfbf8;--edge:#1c4a38;--hi:rgba(255,255,255,.85);--sh:35,50,42;--track:#dbe0d8;color-scheme:light}
html[data-ct="comfort"] body{--bg:#dde2d2;--cream:#dde2d2;--card:#e9ecde;--mint:#d2d9c5;--ink:#26301f;--muted:#566049;--line:#bfc6af;--accent:#44693a;--accent-ink:#f2f5e8;--forest:#44693a;--sage:#7d9470;--warnbg:#e5dba5;--warnink:#473a00;--good:#2c6b36;--bad:#9a3a2e;--hl:#e3d896;--diabg:#f1f3e6;--edge:#2c4726;--hi:rgba(255,255,240,.7);--sh:40,52,30;--track:#cfd6c1;color-scheme:light}
html[data-ct="dark"] body{--bg:#14181a;--cream:#14181a;--card:#1d2326;--mint:#252d31;--ink:#dbe2de;--muted:#8f9d96;--line:#2c3539;--accent:#79c3a0;--accent-ink:#0e1a14;--forest:#0f1315;--sage:#5f9a7f;--warnbg:#33301a;--warnink:#e6d894;--good:#86d3a5;--bad:#ee948a;--hl:#4a4520;--diabg:#d9dfdb;--edge:#3f7a60;--hi:rgba(255,255,255,.07);--sh:0,0,0;--track:#101416;color-scheme:dark}

/* ---- type: Young Serif headings, DM Sans interface, Source Serif for reading ---- */
html[data-ct] body{font-family:var(--f-ui)}
html[data-ct] h1,html[data-ct] h2,html[data-ct] h3{font-family:var(--f-head);font-weight:400;letter-spacing:.005em}
html[data-ct] #reader .body{font-family:var(--f-read);font-size:calc(var(--fs,18px) * var(--tsz,1));line-height:var(--clh,1.8);letter-spacing:var(--cls,0em)}
html[data-ct] #reader{max-width:70ch}
@media (max-width:600px){html[data-ct] #reader .body{font-size:calc(max(var(--fs,18px),18px) * var(--tsz,1))}}
html[data-ct] ::selection{background:var(--hl);color:var(--ink)}

/* ---- tactile surfaces (cards sit on the page, buttons press down) ---- */
html[data-ct] .card,html[data-ct] .topbar{box-shadow:inset 0 1px 0 var(--hi),0 1px 2px rgba(var(--sh),.18),0 10px 22px -12px rgba(var(--sh),.45)}
html[data-ct] .card{border-color:var(--line)}
html[data-ct] .btn,html[data-ct] .btn.small{box-shadow:inset 0 1px 0 var(--hi),0 3px 0 var(--edge),0 8px 12px -6px rgba(var(--sh),.5);transform:translateY(0);transition:transform .12s,box-shadow .12s}
html[data-ct] .btn:active{transform:translateY(2px);box-shadow:inset 0 1px 0 var(--hi),0 1px 0 var(--edge),0 3px 6px -4px rgba(var(--sh),.5)}
html[data-ct] .btn:hover{filter:brightness(1.04)}

html.cm-fade body,html.cm-fade .card,html.cm-fade .topbar{transition:background-color .6s ease,color .6s ease,border-color .6s ease}
html[data-rm] *,html[data-rm] *::before,html[data-rm] *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
@media (prefers-reduced-motion:reduce){html[data-ct] *{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}

/* ---- warmth + dimmer overlays ---- */
#cmWarm,#cmDim{position:fixed;inset:0;pointer-events:none;z-index:9990;transition:opacity .4s}
#cmWarm{background:rgb(255,140,40);mix-blend-mode:multiply;opacity:0}
#cmDim{background:#000;opacity:0}

/* ---- Comfort button in the top bar ---- */
#cmBtn{font:700 14px/1 var(--f-ui);color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:999px;padding:8px 14px;cursor:pointer;display:inline-flex;gap:7px;align-items:center;box-shadow:inset 0 1px 0 var(--hi),0 2px 0 var(--line),0 5px 8px -5px rgba(var(--sh),.5);transition:transform .12s,box-shadow .12s}
#cmBtn:active{transform:translateY(2px);box-shadow:inset 0 1px 0 var(--hi),0 0 0 var(--line)}
#cmBtn:focus-visible,.cm button:focus-visible,.cm input:focus-visible,.brk button:focus-visible,.tmBox button:focus-visible,.fwBox button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.cm *{box-sizing:border-box}

/* ---- panel: a sheet of paper lifted off the page ---- */
.cmScrim{position:fixed;inset:0;background:rgba(10,14,12,.5);z-index:9995;opacity:0;pointer-events:none;transition:opacity .3s}
.cmScrim.on{opacity:1;pointer-events:auto}
.cmPanel{position:fixed;top:10px;right:10px;bottom:10px;width:min(396px,calc(100% - 20px));background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:22px;z-index:9996;padding:22px 20px 26px;overflow:auto;transform:translateX(112%) rotate(1.2deg);transition:transform .4s cubic-bezier(.2,.9,.25,1);font-family:var(--f-ui);line-height:1.45;box-shadow:inset 0 1px 0 var(--hi),0 2px 0 rgba(var(--sh),.12),0 30px 60px -20px rgba(var(--sh),.65)}
.cmPanel.on{transform:none}
@media (max-width:640px){.cmPanel{top:auto;left:8px;right:8px;bottom:8px;width:auto;max-height:90vh;transform:translateY(112%)}}
.cmPanel h2{font:400 1.6rem/1.1 var(--f-head);margin:0 0 2px;color:var(--ink)}
.cmPanel .sub{font:700 1.05rem/1.2 var(--f-hand);color:var(--muted);margin:0 0 6px}
.cmX{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:15px;cursor:pointer;box-shadow:inset 0 1px 0 var(--hi),0 2px 0 var(--line)}
.cmX:active{transform:translateY(2px);box-shadow:none}
.cmPanel h3{font:700 .72rem/1 var(--f-ui);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:22px 0 9px}
/* segmented control: sunken track, raised pill */
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:3px;background:var(--track);padding:4px;border-radius:14px;box-shadow:inset 0 2px 4px rgba(var(--sh),.28),inset 0 -1px 0 var(--hi)}
.seg button{background:none;border:0;color:var(--ink);padding:9px 2px;border-radius:10px;font:500 .9rem var(--f-ui);cursor:pointer;min-height:40px}
.seg button[aria-pressed=true]{background:var(--card);color:var(--ink);font-weight:700;box-shadow:inset 0 1px 0 var(--hi),0 2px 0 var(--accent),0 4px 8px -3px rgba(var(--sh),.55)}
.cmRow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:11px 0}
.cmRow label,.cmRow .l{font-size:.96rem;font-weight:500}
.cmRow small{display:block;color:var(--muted);font-size:.8rem;font-weight:400}
.cmVal{font:500 .85rem var(--f-ui);font-variant-numeric:tabular-nums;color:var(--muted);min-width:3.2em;text-align:right}
/* sliders: carved groove and a round knob */
.cm input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:30px;background:none}
.cm input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:9px;background:var(--track);box-shadow:inset 0 2px 3px rgba(var(--sh),.35)}
.cm input[type=range]::-moz-range-track{height:8px;border-radius:9px;background:var(--track);box-shadow:inset 0 2px 3px rgba(var(--sh),.35)}
.cm input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-9px;border-radius:50%;border:1px solid var(--edge);background:radial-gradient(circle at 35% 30%,var(--hi),var(--card) 55%,var(--line));box-shadow:0 3px 0 var(--edge),0 6px 8px -2px rgba(var(--sh),.5);cursor:grab}
.cm input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;border:1px solid var(--edge);background:radial-gradient(circle at 35% 30%,var(--hi),var(--card) 55%,var(--line));box-shadow:0 3px 0 var(--edge),0 6px 8px -2px rgba(var(--sh),.5);cursor:grab}
/* switches: sunken slot, raised knob */
.sw{appearance:none;-webkit-appearance:none;width:50px;height:28px;border-radius:99px;background:var(--track);border:0;position:relative;cursor:pointer;flex:none;box-shadow:inset 0 2px 4px rgba(var(--sh),.4);transition:background .25s}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--hi),var(--card) 60%,var(--line));box-shadow:0 2px 0 rgba(var(--sh),.35),0 4px 6px -1px rgba(var(--sh),.5);transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
.sw:checked{background:var(--accent)}
.sw:checked::after{transform:translateX(22px)}
.cmNum{width:80px;background:var(--track);color:var(--ink);border:0;border-radius:12px;padding:10px;font:500 1rem var(--f-ui);text-align:center;box-shadow:inset 0 2px 4px rgba(var(--sh),.3)}
.cmTxt{width:100%;background:var(--track);color:var(--ink);border:0;border-radius:12px;padding:11px 13px;font:400 .95rem var(--f-ui);margin-top:8px;box-shadow:inset 0 2px 4px rgba(var(--sh),.3)}
.cmTxt::placeholder{color:var(--muted)}
.cmBtn{background:var(--accent);color:var(--accent-ink);border:0;border-radius:12px;padding:11px 18px;font:700 .95rem/1 var(--f-ui);cursor:pointer;min-height:44px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 0 var(--edge),0 9px 12px -6px rgba(var(--sh),.6);transition:transform .12s,box-shadow .12s}
.cmBtn:active{transform:translateY(3px);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 0 var(--edge)}
.cmBtn.ghost{background:var(--card);color:var(--ink);border:1px solid var(--line);font-weight:500;box-shadow:inset 0 1px 0 var(--hi),0 3px 0 var(--line),0 8px 10px -6px rgba(var(--sh),.4)}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0}
.chips button{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:99px;padding:7px 13px;font:500 .88rem var(--f-ui);cursor:pointer;min-height:36px;box-shadow:inset 0 1px 0 var(--hi),0 2px 0 var(--line)}
.chips button:active{transform:translateY(2px);box-shadow:none}
.cmNote{font-size:.82rem;color:var(--muted);margin:7px 0 0}
.cmReset{margin-top:20px;width:100%}

/* ---- timer chip ---- */
#cmChip{position:fixed;left:14px;bottom:14px;z-index:9980;display:none;align-items:center;gap:9px;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:99px;padding:8px 8px 8px 15px;font:700 .98rem/1 var(--f-ui);font-variant-numeric:tabular-nums;box-shadow:inset 0 1px 0 var(--hi),0 3px 0 var(--line),0 12px 18px -8px rgba(var(--sh),.6)}
#cmChip.on{display:inline-flex}
#cmChip button{background:var(--track);border:0;color:var(--ink);width:28px;height:28px;border-radius:50%;cursor:pointer;box-shadow:inset 0 1px 3px rgba(var(--sh),.3)}
body.focus #cmChip{opacity:.6}

/* ---- break card: looks like a note card stuck on the page ---- */
.brk{position:fixed;right:16px;bottom:16px;width:min(344px,calc(100% - 32px));z-index:9985;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:20px;padding:18px;font-family:var(--f-ui);transform:translateY(26px) rotate(1.5deg);opacity:0;pointer-events:none;transition:transform .5s cubic-bezier(.2,1.1,.3,1),opacity .4s;box-shadow:inset 0 1px 0 var(--hi),0 3px 0 rgba(var(--sh),.15),0 24px 40px -16px rgba(var(--sh),.7)}
.brk.on{transform:rotate(-.6deg);opacity:1;pointer-events:auto}
.brk h4{margin:0 0 4px;font:400 1.25rem/1.2 var(--f-head);color:var(--ink)}
.brk p{margin:0 0 12px;font-size:.92rem;color:var(--muted);line-height:1.45}
.brk .top{display:flex;gap:14px;align-items:center;margin-bottom:12px}
.ring{--p:0;width:66px;height:66px;border-radius:50%;flex:none;background:conic-gradient(var(--accent) calc(var(--p)*1%),var(--track) 0);display:grid;place-items:center;box-shadow:inset 0 2px 4px rgba(var(--sh),.35)}
.ring span{width:50px;height:50px;border-radius:50%;background:var(--card);display:grid;place-items:center;font:700 1.05rem/1 var(--f-ui);font-variant-numeric:tabular-nums;color:var(--ink);box-shadow:0 2px 4px rgba(var(--sh),.4)}
.brk .acts{display:flex;flex-wrap:wrap;gap:9px}
.brk .acts button{flex:1 1 auto;border-radius:12px;padding:10px 12px;font:700 .88rem/1.1 var(--f-ui);cursor:pointer;min-height:44px;border:1px solid var(--line);background:var(--card);color:var(--ink);box-shadow:inset 0 1px 0 var(--hi),0 3px 0 var(--line)}
.brk .acts button.p{background:var(--accent);color:var(--accent-ink);border-color:var(--edge);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 3px 0 var(--edge)}
.brk .acts button:active{transform:translateY(2px);box-shadow:none}
.brk .off{margin-top:9px;background:none;border:0;color:var(--muted);font:400 .82rem var(--f-ui);text-decoration:underline;cursor:pointer;padding:6px 0}

/* ---- timer popup: emoji sits on a raised medallion ---- */
.tmOv{position:fixed;inset:0;z-index:9999;background:rgba(10,14,12,.6);display:grid;place-items:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .35s}
.tmOv.on{opacity:1;pointer-events:auto}
.tmBox{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:26px;padding:0 24px 22px;max-width:380px;width:100%;text-align:center;font-family:var(--f-ui);transform:scale(.9) rotate(-2deg);transition:transform .5s cubic-bezier(.2,1.4,.4,1);box-shadow:inset 0 1px 0 var(--hi),0 4px 0 rgba(var(--sh),.15),0 36px 60px -20px rgba(var(--sh),.8)}
.tmOv.on .tmBox{transform:rotate(-.5deg)}
.tmEmoji{display:grid;place-items:center;width:104px;height:104px;margin:-40px auto 12px;border-radius:50%;font-size:54px;line-height:1;background:radial-gradient(circle at 32% 26%,var(--hi),var(--card) 52%,var(--mint));border:1px solid var(--line);box-shadow:inset 0 -5px 8px rgba(var(--sh),.18),0 5px 0 var(--line),0 18px 22px -8px rgba(var(--sh),.6)}
.tmOv.on .tmEmoji{animation:cmBob 1.5s ease-in-out 2}
@keyframes cmBob{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-10px) rotate(-7deg)}60%{transform:translateY(0) rotate(6deg)}}
.tmBox h3{font:400 1.6rem/1.15 var(--f-head);margin:0 0 6px;color:var(--ink)}
.tmBox p{margin:0 0 18px;color:var(--muted);line-height:1.5}
.tmBox .acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}

/* ---- feedback wall ---- */
.fwOv{position:fixed;inset:0;z-index:9994;background:rgba(10,14,12,.55);display:grid;place-items:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .3s}
.fwOv.on{opacity:1;pointer-events:auto}
.fwBox{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:24px;width:min(640px,100%);max-height:90vh;overflow:auto;padding:24px;font-family:var(--f-ui);transform:translateY(18px) rotate(.6deg);transition:transform .45s cubic-bezier(.2,.9,.25,1);box-shadow:inset 0 1px 0 var(--hi),0 4px 0 rgba(var(--sh),.12),0 34px 60px -22px rgba(var(--sh),.7)}
.fwOv.on .fwBox{transform:none}
.fwTop{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.fwTop h2{margin:0;font:400 1.7rem/1.1 var(--f-head);color:var(--ink)}
.fwSub{margin:4px 0 16px;font:700 1.1rem var(--f-hand);color:var(--muted)}
.fwP{display:inline-flex;gap:1px;vertical-align:middle}
.fwStat{display:flex;gap:22px;align-items:center;background:var(--track);border-radius:16px;padding:16px;margin-bottom:14px;flex-wrap:wrap;box-shadow:inset 0 2px 5px rgba(var(--sh),.25)}
.fwAvg{text-align:center;min-width:100px}.fwAvg strong{display:block;font:400 2.8rem/1 var(--f-head)}.fwAvg small{display:block;color:var(--muted);margin-top:4px}
.fwDist{flex:1;min-width:160px}.fwBar{display:flex;align-items:center;gap:8px;font-size:.85rem;margin:4px 0}
.fwBar i{flex:1;height:9px;border-radius:9px;background:var(--bg);overflow:hidden;display:block;box-shadow:inset 0 1px 2px rgba(var(--sh),.35)}.fwBar b{display:block;height:100%;background:var(--accent);border-radius:9px}.fwBar em{font-style:normal;color:var(--muted);min-width:1.5em;text-align:right}
.fwF button[aria-pressed=true]{background:var(--accent);color:var(--accent-ink);border-color:var(--edge);font-weight:700;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 2px 0 var(--edge)}
.fwC{border:1px solid var(--line);border-radius:16px;padding:14px 15px;margin:12px 0;background:var(--card);box-shadow:inset 0 1px 0 var(--hi),0 2px 0 var(--line),0 12px 16px -12px rgba(var(--sh),.5)}
.fwC:nth-of-type(odd){transform:rotate(-.25deg)}.fwC:nth-of-type(even){transform:rotate(.2deg)}
.fwC.own{border-style:dashed}
.fwH{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.fwH b{font-weight:700}.fwH time{margin-left:auto;color:var(--muted);font-size:.8rem}.fwY{font-size:.75rem;color:var(--muted);border:1px solid var(--line);border-radius:99px;padding:2px 8px}
.fwC p{margin:9px 0 0;font-family:var(--f-read);line-height:1.6;overflow-wrap:anywhere}
.fwT{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.fwT span{font-size:.78rem;color:var(--muted);background:var(--track);border-radius:99px;padding:3px 10px}
.fwEmpty{text-align:center;padding:28px 10px;color:var(--muted)}.fwEmpty span{font-size:44px;display:block}.fwEmpty p{font:700 1.3rem/1.3 var(--f-hand);margin:8px 0 0}
.fwFoot{margin-top:16px;text-align:center}
@media print{#cmBtn,#cmWarm,#cmDim,#cmChip,.brk,.tmOv,.cmPanel,.cmScrim,.fwOv{display:none!important}}
'''
FILES['comfort.js'] = r'''/* VetNet comfort panel, break reminders and optional manual timer. No dependencies. */
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
'''
FILES['feedback-wall.js'] = r'''/* VetNet public feedback wall: reads moderated entries, shows average + cards. Needs script.js feedback form for "Add yours". */
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
'''
FILES['feedback-data.js'] = r'''/* PUBLIC FEEDBACK WALL: add approved feedback here (you moderate it, nobody can fake entries).
   Copy the example line, remove the // and fill it in. Newest first. rating = 1 to 5. */
window.VETNET_FEEDBACK = [
  // { name: "Anitha, BVSc 2nd year", rating: 5, text: "The short notes before exams saved me.", tags: ["Clear notes"], date: "2026-11-20" },
];
/* Optional: a published Google Sheet (File > Share > Publish to web > CSV) with columns
   name,rating,text,tags,date. Paste its link here and approved rows appear automatically. */
window.VETNET_FEED_URL = "";
'''

if not os.path.exists("index.html"): sys.exit("Run this inside the folder that has index.html")
for name, body in FILES.items():
    if name == "feedback-data.js" and os.path.exists(name): print("kept your existing", name); continue
    with open(name, "w", encoding="utf-8", newline="\n") as f: f.write(body)
    print("wrote", name)
raw = open("index.html", "rb").read()
bom = raw.startswith(b"\xef\xbb\xbf")
txt = raw.decode("utf-8-sig")
nl = "\r\n" if "\r\n" in txt else "\n"
if "comfort.js" in txt: print("index.html already patched."); sys.exit()
shutil.copy("index.html", "index.html.bak")
if "</head>" not in txt or "</body>" not in txt: sys.exit("index.html has no </head> or </body>")
txt = txt.replace("</head>", '<link rel="stylesheet" href="comfort.css">' + nl + '<script src="comfort-boot.js"></script>' + nl + "</head>", 1)
i = txt.rfind("</body>")
txt = txt[:i] + '<script src="feedback-data.js"></script>' + nl + '<script src="comfort.js"></script>' + nl + '<script src="feedback-wall.js"></script>' + nl + "</body>" + txt[i + 7:]
open("index.html", "wb").write((b"\xef\xbb\xbf" if bom else b"") + txt.encode("utf-8"))
print("index.html patched. Backup: index.html.bak. Now open index.html and click Comfort.")