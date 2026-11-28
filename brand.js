/* VetNet brand (add-on): your logo in the top bar and on every page of downloaded PDFs. */
(function () {
  "use strict";
  var LOGO = "logo.png";
  var css = ".brand .brandLogo{height:44px;width:auto;border-radius:9px;background:#fff;padding:2px 6px;display:block}" +
    ".brand.hasLogo>span{position:absolute;left:-9999px}" +
    "@media (max-width:640px){.brand .brandLogo{height:34px}}" +
    "@media print{" +
    "#printArea .pSpT{height:31mm!important}" +
    "#printArea .pHead{top:6mm!important;align-items:center!important;padding-bottom:2mm!important}" +
    "#printArea .pHead .pLogo{height:17mm;width:auto;display:block}" +
    "#printArea .pHead .pr{font:600 10pt 'Segoe UI',Calibri,Arial,sans-serif!important;color:#1f4d3a!important}" +
    "#printArea .cvLogo{width:42mm;height:auto;display:block;margin:0 0 8mm}" +
    "}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function navLogo() {
    var b = document.querySelector(".brand"); if (!b || b.querySelector(".brandLogo")) return;
    var svg = b.querySelector("svg"), img = document.createElement("img");
    img.className = "brandLogo"; img.src = LOGO; img.alt = "VetNet"; img.decoding = "async";
    if (svg) b.replaceChild(img, svg); else b.insertBefore(img, b.firstChild);
    b.classList.add("hasLogo");
  }

  function patchPrint() {
    if (typeof window.doPrint !== "function" || window.doPrint.__brand) return;
    var orig = window.doPrint;
    window.doPrint = function (ids, title) {
      orig.apply(this, arguments);
      try {
        var box = document.getElementById("printArea"); if (!box) return;
        var hb = box.querySelector(".pHead > b");
        if (hb) { var im = document.createElement("img"); im.className = "pLogo"; im.src = LOGO; im.alt = "VetNet"; hb.parentNode.replaceChild(im, hb); }
        var ck = box.querySelector(".cover .cvk");
        if (ck) { var c = document.createElement("img"); c.className = "cvLogo"; c.src = LOGO; c.alt = "VetNet"; ck.parentNode.replaceChild(c, ck); }
      } catch (e) {}
    };
    window.doPrint.__brand = true;
    var pre = new Image(); pre.src = LOGO;
  }
  navLogo(); patchPrint();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { navLogo(); patchPrint(); });
})();