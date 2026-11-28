/* VetNet brand (add-on): your logo in the top bar and on every page of downloaded PDFs. */
(function () {
  "use strict";
  var LOGO = "data:image/jpeg;base64,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";
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