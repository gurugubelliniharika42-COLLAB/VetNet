/* VetNet comfort: runs in <head> BEFORE the page paints, so there is no flash. */
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
