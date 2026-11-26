/* VetNet Diagrams: dog skeleton (whole, forelimb, hindlimb). Add-on file, does not change script.js. */
(function () {
  "use strict";
/* ---- tiny drawing helpers: every bone is a list of primitives ---- */
function P(d, tr) { return { t: "p", d: d, tr: tr }; }                 /* closed filled shape */
function L(d, w) { return { t: "l", d: d, w: w || 5 }; }               /* thick rounded line */
function C(x, y, r) { return { t: "c", x: x, y: y, r: r }; }           /* circle */
function E(x, y, rx, ry, rot) { return { t: "e", x: x, y: y, rx: rx, ry: ry, rot: rot || 0 }; }
function poly(pts) { return "M" + pts.map(function (p) { return p[0] + "," + p[1]; }).join("L") + "Z"; }
function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); return "M" + (x + r) + "," + y + "h" + (w - 2 * r) + "a" + r + "," + r + " 0 0 1 " + r + "," + r + "v" + (h - 2 * r) + "a" + r + "," + r + " 0 0 1 -" + r + "," + r + "h-" + (w - 2 * r) + "a" + r + "," + r + " 0 0 1 -" + r + ",-" + r + "v-" + (h - 2 * r) + "a" + r + "," + r + " 0 0 1 " + r + ",-" + r + "z"; }
/* a long bone: slim shaft with a waist, optional end knobs */
function shaft(x1, y1, x2, y2, w1, w2, wm) {
  var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), nx = -dy / len, ny = dx / len, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  function q(x, y, w, s) { return [x + nx * w / 2 * s, y + ny * w / 2 * s]; }
  return poly([q(x1, y1, w1, 1), q(mx, my, wm, 1), q(x2, y2, w2, 1), q(x2, y2, w2, -1), q(mx, my, wm, -1), q(x1, y1, w1, -1)]);
}
function bez(p0, p1, p2, t) { var a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]; }
function bezAng(p0, p1, p2, t) { var dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]); return Math.atan2(dy, dx) * 180 / Math.PI; }

  var NS = "http://www.w3.org/2000/svg";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function f1(n) { return Math.round(n * 10) / 10; }

  /* ================= WHOLE DOG (lateral view, facing left) ================= */
  function whole() {
    var i, x, y, h, B = [];
    var ribs = [], sternum, thor = [], lumb = [], tail = [], cerv = [];
    /* ribs: 13 pairs, 9 sternal, 4 asternal */
    for (i = 0; i < 13; i++) {
      var x0 = 290 + i * 17.5, y0 = 156 + i * 0.7, x1 = i < 9 ? 300 + i * 11 : 392 + (i - 9) * 26, y1 = i < 9 ? 280 : 262 - (i - 9) * 6;
      ribs.push(L("M" + f1(x0) + "," + f1(y0) + "Q" + f1(x0 - 22) + ",236 " + f1(x1) + "," + f1(y1), 4));
    }
    sternum = [L("M296,284L408,286", 8)];
    for (i = 0; i < 8; i++) sternum.push(C(300 + i * 14.5, 285 + i * 0.2, 5));
    for (i = 0; i < 13; i++) {
      x = 282 + i * 17.5; y = 138 + i * 0.8; h = i < 2 ? 34 : (i < 11 ? 40 - Math.abs(i - 5) * 2 : 18);
      var lean = i < 10 ? 7 : 0;
      thor.push(C(x, y + 10, 7.5));
      thor.push(P(poly([[x - 3, y + 6], [x + lean - 2, y - h], [x + lean + 3, y - h], [x + 4, y + 6]])));
    }
    for (i = 0; i < 7; i++) {
      x = 508 + i * 14; y = 150 - i * 0.8;
      lumb.push(P(rr(x - 8, y - 4, 16, 17, 4)));
      lumb.push(P(poly([[x - 3, y - 2], [x + 1, y - 20], [x + 6, y - 20], [x + 5, y - 2]])));
      lumb.push(L("M" + x + "," + (y + 6) + "L" + (x + 2) + "," + (y + 30), 4));   /* transverse process */
    }
    for (i = 0; i < 21; i++) { var tp = bez([664, 154], [748, 148], [812, 238], i / 20); tail.push(C(tp[0], tp[1], Math.max(2.2, 6.4 - i * 0.2))); }
    for (i = 0; i < 7; i++) { var cp = bez([232, 186], [246, 148], [276, 140], i / 6); cerv.push(C(cp[0], cp[1], 9 - (i === 0 ? 0 : 0.3 * i) + (i === 0 ? 1 : 0))); if (i > 0 && i < 6) cerv.push(P(poly([[cp[0] - 2, cp[1] - 3], [cp[0] + 1, cp[1] - 17], [cp[0] + 5, cp[1] - 17], [cp[0] + 5, cp[1] - 3]]))); }
    var CAR = [E(326, 436, 15, 9), E(346, 428, 9, 11), C(342, 446, 7), C(314, 450, 7)];
    var MC = [], PH = [], k;
    for (k = 0; k < 4; k++) { MC.push(L("M" + (312 + k * 9) + ",452L" + (310 + k * 10) + ",494", 5.5)); PH.push(L("M" + (310 + k * 10) + ",497L" + (308 + k * 10) + ",518", 5)); }
    var MT = [], HP = [];
    for (k = 0; k < 4; k++) { MT.push(L("M" + (634 + k * 8) + ",446L" + (630 + k * 9) + ",492", 5.5)); HP.push(L("M" + (630 + k * 9) + ",495L" + (627 + k * 9) + ",518", 5)); }

    B = [
      { id: "rib", name: "Ribs", prims: ribs, a: [450, 214], l: [490, 450, "m"], f: "13 pairs. The first 9 are sternal (true) ribs. The next 4 are asternal: they join the costal arch or float free. The last pair is floating." },
      { id: "sternum", name: "Sternum", prims: sternum, a: [330, 285], l: [400, 500, "m"], f: "8 sternebrae in a row. The first is the manubrium, the last carries the xiphoid cartilage." },
      { id: "thoracic", name: "Thoracic vertebrae", prims: thor, a: [380, 112], l: [380, 58, "m"], f: "13 in the dog (T1 to T13). Spinous processes are tall and lean back, until T11, the anticlinal vertebra, which stands straight." },
      { id: "lumbar", name: "Lumbar vertebrae", prims: lumb, a: [550, 142], l: [548, 58, "m"], f: "7 lumbar vertebrae with long transverse processes that point forward and down. Common site for disc disease." },
      { id: "sacrum", name: "Sacrum", prims: [P(poly([[598, 132], [664, 150], [664, 166], [604, 160]]))], a: [632, 150], l: [660, 82, "m"], f: "3 fused sacral vertebrae. The first two articulate with the wing of the ilium." },
      { id: "tail", name: "Caudal (tail) vertebrae", prims: tail, a: bez([664, 154], [748, 148], [812, 238], 0.7), l: [888, 262, "e"], f: "20 to 23 caudal vertebrae, decreasing in size to the tip." },
      { id: "cervical", name: "Cervical vertebrae", prims: cerv, a: [250, 158], l: [200, 58, "m"], f: "7 cervical vertebrae (C1 atlas, C2 axis). Like most mammals, the dog has 7, whatever its neck length." },
      { id: "ilium", name: "Ilium", prims: [P(poly([[582, 126], [636, 112], [650, 136], [630, 200], [606, 198]]))], a: [616, 152], l: [888, 92, "e"], f: "The wing of the ilium joins the sacrum. Its cranial point is the tuber coxae (point of the hip)." },
      { id: "ischium", name: "Ischium", prims: [P(poly([[622, 196], [646, 186], [668, 214], [660, 230], [636, 222]])), C(628, 218, 14)], a: [656, 214], l: [888, 134, "e"], f: "Forms the caudal part of the pelvic floor. The tuber ischiadicum is the pin bone you can feel under the tail base." },
      { id: "pubis", name: "Pubis", prims: [P(poly([[606, 204], [626, 206], [616, 244], [596, 238]]))], a: [610, 228], l: [510, 470, "m"], f: "Forms the cranial part of the pelvic floor. Ilium, ischium and pubis meet at the acetabulum." },
      { id: "femur", name: "Femur", prims: [P(shaft(630, 236, 590, 338, 20, 24, 14)), C(632, 232, 12)], a: [610, 288], l: [888, 300, "e"], f: "The longest, strongest bone of the dog. The head sits in the acetabulum, the greater trochanter is the lateral bump." },
      { id: "patella", name: "Patella", prims: [E(574, 336, 7, 10)], a: [574, 336], l: [510, 400, "m"], f: "The largest sesamoid bone, held inside the quadriceps tendon. It glides in the trochlea of the femur." },
      { id: "tibia", name: "Tibia", prims: [P(shaft(592, 346, 642, 428, 18, 16, 11))], a: [616, 388], l: [888, 340, "e"], f: "The main weight-bearing bone of the leg. The tibial tuberosity at the top is where the patellar ligament attaches." },
      { id: "fibula", name: "Fibula", prims: [L("M606,352L650,424", 3.5)], a: [628, 388], l: [888, 376, "e"], f: "A thin, non-weight-bearing bone beside the tibia. It ends as the lateral malleolus." },
      { id: "tarsus", name: "Tarsal bones", prims: [P(poly([[640, 414], [658, 398], [668, 412], [660, 444], [640, 444]])), E(638, 442, 10, 8), C(652, 456, 6), C(640, 460, 5)], a: [652, 432], l: [888, 420, "e"], f: "7 tarsal bones: talus, calcaneus, central and tarsals 1 to 4. The calcaneus forms the point of the hock." },
      { id: "metatarsals", name: "Metatarsals", prims: MT, a: [645, 470], l: [888, 468, "e"], f: "Metatarsals II to V carry the weight. Metatarsal I is usually absent, and a hind dewclaw is rare." },
      { id: "hphal", name: "Hind phalanges", prims: HP, a: [645, 507], l: [888, 514, "e"], f: "The hind foot usually has 4 digits. Each has three phalanges, the last one is inside the claw." },
      { id: "scapula", name: "Scapula", prims: [P(poly([[270, 118], [320, 126], [270, 228], [240, 226]])), L("M296,124L254,226", 3)], a: [284, 170], l: [20, 266, "s"], f: "Flat blade with a spine along its lateral face. The dog has no functional clavicle, so the forelimb is attached to the trunk only by muscle." },
      { id: "humerus", name: "Humerus", prims: [P(shaft(252, 232, 316, 318, 18, 16, 12)), C(254, 232, 12)], a: [286, 276], l: [20, 306, "s"], f: "The arm bone. Its head joins the scapula at the shoulder joint, its distal end forms the elbow with the radius and ulna." },
      { id: "ulna", name: "Ulna", prims: [P(poly([[298, 296], [320, 296], [326, 330], [310, 330]])), P(shaft(316, 326, 324, 428, 9, 7, 7))], a: [318, 380], l: [20, 400, "s"], f: "Its proximal end, the olecranon, is the point of the elbow. It is the lateral, caudal bone of the forearm." },
      { id: "radius", name: "Radius", prims: [P(shaft(308, 328, 316, 428, 11, 13, 9))], a: [312, 372], l: [20, 356, "s"], f: "The main weight-bearing bone of the forearm. It lies cranial and medial to the ulna." },
      { id: "carpus", name: "Carpal bones", prims: CAR, a: [326, 436], l: [20, 446, "s"], f: "7 carpal bones: radial, ulnar and accessory in the proximal row, and carpals 1 to 4 in the distal row. The accessory carpal is the pad behind the wrist." },
      { id: "metacarpals", name: "Metacarpals", prims: MC, a: [320, 474], l: [20, 490, "s"], f: "5 metacarpals. Metacarpal I is short and carries the dewclaw. Metacarpals II to V support the weight." },
      { id: "fphal", name: "Fore phalanges", prims: PH, a: [318, 508], l: [20, 530, "s"], f: "Digit I (dewclaw) has 2 phalanges, digits II to V have 3. The last phalanx is inside the claw." },
      { id: "skull", name: "Skull", prims: [P("M64,166Q66,150 100,146L146,140Q160,112 196,114Q230,120 228,156Q226,190 200,198L150,196L96,190Q64,184 64,166Z"), L("M150,176Q184,168 208,176", 5), C(168, 158, 9)], a: [120, 156], l: [20, 112, "s"], f: "Shape varies a lot between breeds. Dolichocephalic (Greyhound), mesaticephalic (Labrador) and brachycephalic (Pug) skulls differ in length." },
      { id: "mandible", name: "Mandible", prims: [P(poly([[78, 188], [150, 200], [204, 202], [200, 216], [112, 212], [72, 196]]))], a: [130, 207], l: [20, 230, "s"], f: "Dog mandibles are two halves joined at the mandibular symphysis. The teeth: 42 in an adult dog." }
    ];
    return { id: "whole", title: "Whole dog skeleton", vb: [900, 560], ground: 520, bones: B, pins: [
      { x: 306, y: 304, n: "Olecranon", h: "The point of the elbow. Feel it behind the elbow joint. Good for finding the ulna." },
      { x: 342, y: 436, n: "Accessory carpal", h: "A pad-shaped bone on the back of the carpus. Easy to feel at the back of the wrist." },
      { x: 590, y: 122, n: "Tuber coxae", h: "Point of the hip. The cranial point of the wing of the ilium, easy to feel on the flank." },
      { x: 664, y: 214, n: "Tuber ischiadicum", h: "Pin bone. Feel it either side of the anus, under the tail base." },
      { x: 640, y: 232, n: "Greater trochanter", h: "Lateral bump at the top of the femur. Feel it just below and in front of the hip." },
      { x: 584, y: 350, n: "Tibial tuberosity", h: "Bump at the front of the tibia, just below the patella. A landmark for stifle surgery." },
      { x: 664, y: 402, n: "Calcaneal tuber", h: "Point of the hock. It is where the Achilles (common calcanean) tendon attaches." }
    ] };
  }

  /* ================= FORELIMB (lateral, detailed) ================= */
  function fore() {
    var MC = [], P1 = [], P2 = [], P3 = [], k, xs = [208, 232, 256, 280];
    for (k = 0; k < 4; k++) {
      var fx = (k - 1.5) * 4;
      MC.push(L("M" + xs[k] + ",540L" + (xs[k] + fx) + ",606", 11));
      P1.push(L("M" + (xs[k] + fx) + ",612L" + (xs[k] + fx * 1.6) + ",642", 10));
      P2.push(L("M" + (xs[k] + fx * 1.6) + ",647L" + (xs[k] + fx * 2) + ",668", 9));
      P3.push(P(poly([[xs[k] + fx * 2 - 5, 672], [xs[k] + fx * 2 + 5, 672], [xs[k] + fx * 2 + 3, 696], [xs[k] + fx * 2 - 2, 696]])));
    }
    return { id: "fore", title: "Forelimb", vb: [520, 700], ground: 698, bones: [
      { id: "scapula", name: "Scapula", prims: [P(poly([[96, 18], [214, 30], [150, 196], [88, 190]])), L("M146,22L122,190", 4), C(128, 198, 14)], a: [170, 100], l: [20, 60, "s"], f: "Flat blade with a spine. The supraspinous and infraspinous fossae lie on each side of the spine. The glenoid cavity forms the shoulder joint." },
      { id: "humerus", name: "Humerus", prims: [C(132, 212, 18), E(112, 206, 11, 9), P(shaft(134, 212, 222, 352, 28, 22, 17)), C(224, 358, 17)], a: [176, 284], l: [20, 260, "s"], f: "The head is round and sits in the glenoid. The greater tubercle at the front is the attachment for the supraspinatus." },
      { id: "ulna", name: "Ulna", prims: [P(poly([[232, 330], [264, 322], [272, 346], [242, 376]])), P(shaft(246, 366, 254, 484, 15, 10, 11))], a: [256, 432], l: [500, 400, "e"], f: "The olecranon is the point of the elbow, where the triceps attaches. The ulna is slim and the radius carries most of the weight." },
      { id: "radius", name: "Radius", prims: [P(shaft(212, 372, 236, 486, 20, 16, 14))], a: [224, 430], l: [20, 400, "s"], f: "The main weight-bearing bone of the forearm. It rotates around the ulna only a little in the dog, so the paw can twist but not turn like a hand." },
      { id: "radcarp", name: "Radial carpal", prims: [E(226, 504, 17, 12)], a: [226, 504], l: [20, 470, "s"], f: "The largest carpal. It is a fused bone (radial + intermediate + central) in the dog." },
      { id: "ulncarp", name: "Ulnar carpal", prims: [E(250, 500, 12, 10)], a: [250, 500], l: [500, 460, "e"], f: "Lies lateral to the radial carpal, below the ulna." },
      { id: "acccarp", name: "Accessory carpal", prims: [E(278, 486, 9, 14, 12)], a: [278, 486], l: [500, 510, "e"], f: "Projects caudally. It is the pad you can feel on the back of the wrist." },
      { id: "dcarp", name: "Carpals 1 to 4", prims: [C(206, 526, 7), C(228, 528, 8), C(250, 526, 8), C(270, 522, 7)], a: [228, 528], l: [20, 530, "s"], f: "The distal row has four bones (C1 to C4), one above each metacarpal." },
      { id: "mc", name: "Metacarpals", prims: MC, a: [244, 574], l: [500, 580, "e"], f: "Metacarpals II to V carry the weight and are about equal in length. Metacarpal I is short, and makes the dewclaw." },
      { id: "p1", name: "Proximal phalanges (P1)", prims: P1, a: [244, 628], l: [20, 610, "s"], f: "First phalanx of each digit. Together with P2 it forms the part of the toe with the pad under it." },
      { id: "p2", name: "Middle phalanges (P2)", prims: P2, a: [244, 658], l: [500, 640, "e"], f: "Second phalanx. Digit I (dewclaw) has only two phalanges, so it has no middle phalanx." },
      { id: "p3", name: "Distal phalanges (P3)", prims: P3, a: [244, 686], l: [20, 670, "s"], f: "The claw grows from the P3, which has the ungual crest. Cutting a claw too deep can hurt the bone." }
    ], pins: [
      { x: 118, y: 192, n: "Acromion / spine end", h: "The end of the scapular spine, a landmark at the front of the shoulder." },
      { x: 108, y: 200, n: "Greater tubercle", h: "The bump at the front of the shoulder joint, in front of the humeral head." },
      { x: 256, y: 336, n: "Olecranon", h: "The point of the elbow. Feel it behind the elbow joint." },
      { x: 284, y: 472, n: "Accessory carpal", h: "The pad on the back of the wrist. It is easy to feel." }
    ] };
  }

  /* ================= HINDLIMB (lateral, detailed) ================= */
  function hind() {
    var MT = [], P1 = [], P2 = [], P3 = [], k, xs = [200, 224, 248, 272];
    for (k = 0; k < 4; k++) {
      var fx = (k - 1.5) * 4;
      MT.push(L("M" + xs[k] + ",584L" + (xs[k] + fx) + ",628", 11));
      P1.push(L("M" + (xs[k] + fx) + ",634L" + (xs[k] + fx * 1.6) + ",654", 10));
      P2.push(L("M" + (xs[k] + fx * 1.6) + ",659L" + (xs[k] + fx * 2) + ",674", 9));
      P3.push(P(poly([[xs[k] + fx * 2 - 5, 678], [xs[k] + fx * 2 + 5, 678], [xs[k] + fx * 2 + 3, 696], [xs[k] + fx * 2 - 2, 696]])));
    }
    return { id: "hind", title: "Hindlimb", vb: [520, 700], ground: 698, bones: [
      { id: "ilium", name: "Ilium", prims: [P(poly([[150, 18], [254, 30], [246, 124], [228, 172], [196, 172], [164, 146]]))], a: [200, 80], l: [20, 60, "s"], f: "The wing of the ilium has the tuber coxae at its front and the tuber sacrale behind. It joins the sacrum." },
      { id: "ischium", name: "Ischium", prims: [P(poly([[232, 156], [264, 196], [270, 230], [248, 232], [212, 192]]))], a: [250, 206], l: [500, 200, "e"], f: "The caudal part of the pelvic floor. The tuber ischiadicum is the point you feel beside the anus." },
      { id: "pubis", name: "Pubis", prims: [P(poly([[168, 172], [208, 196], [196, 236], [160, 214]])), C(212, 176, 17)], a: [184, 210], l: [20, 230, "s"], f: "The cranial part of the pelvic floor. Ilium, ischium and pubis meet at the acetabulum." },
      { id: "femur", name: "Femur", prims: [C(214, 180, 16), E(190, 186, 11, 14), P(shaft(212, 186, 160, 346, 26, 22, 18)), C(158, 354, 19)], a: [186, 266], l: [500, 280, "e"], f: "The longest bone of the dog. The head fits into the acetabulum, and the greater trochanter is a lateral bump." },
      { id: "patella", name: "Patella", prims: [E(130, 354, 10, 14)], a: [130, 354], l: [20, 340, "s"], f: "The largest sesamoid bone, in the quadriceps tendon. Medial patellar luxation is common in small breeds." },
      { id: "tibia", name: "Tibia", prims: [P(poly([[146, 372], [186, 366], [190, 392], [152, 396]])), P(shaft(168, 380, 232, 524, 24, 18, 15))], a: [200, 456], l: [20, 440, "s"], f: "The main weight-bearing bone. The tibial tuberosity at its top is where the patellar ligament attaches." },
      { id: "fibula", name: "Fibula", prims: [L("M186,384L242,518", 5)], a: [214, 450], l: [500, 400, "e"], f: "A thin, non-weight-bearing bone beside the tibia. Its distal end forms the lateral malleolus." },
      { id: "calc", name: "Calcaneus", prims: [P(poly([[224, 496], [260, 462], [276, 484], [252, 548], [228, 540]]))], a: [252, 500], l: [500, 500, "e"], f: "The point of the hock is the calcaneal tuber, where the Achilles (common calcanean) tendon attaches." },
      { id: "talus", name: "Talus", prims: [E(222, 528, 17, 13)], a: [222, 528], l: [20, 520, "s"], f: "Sits between the tibia and calcaneus. Its trochlea fits the tibia and makes the hock hinge." },
      { id: "tars", name: "Other tarsals", prims: [E(238, 558, 11, 8), C(210, 570, 7), C(228, 574, 7), C(246, 574, 7), C(264, 568, 7)], a: [238, 566], l: [500, 560, "e"], f: "The central tarsal and tarsals 1 to 4 complete the 7 tarsal bones." },
      { id: "mt", name: "Metatarsals", prims: MT, a: [236, 606], l: [20, 600, "s"], f: "Metatarsals II to V are long and slim. Metatarsal I is usually missing, a hind dewclaw is rare." },
      { id: "phal", name: "Phalanges", prims: P1.concat(P2, P3), a: [236, 660], l: [500, 650, "e"], f: "4 digits, each with 3 phalanges. The last phalanx sits inside the claw." }
    ], pins: [
      { x: 156, y: 24, n: "Tuber coxae", h: "Point of the hip. Easy to feel at the front of the flank." },
      { x: 264, y: 214, n: "Tuber ischiadicum", h: "Pin bone. Feel it either side of the anus." },
      { x: 184, y: 184, n: "Greater trochanter", h: "Bump at the top of the femur, just below the hip." },
      { x: 146, y: 384, n: "Tibial tuberosity", h: "Bump at the front of the tibia, just under the patella." },
      { x: 268, y: 474, n: "Calcaneal tuber", h: "Point of the hock, where the Achilles tendon attaches." }
    ] };
  }

  /* ================= ENGINE ================= */
  var VIEWS = {}, VORDER = ["whole", "fore", "hind"], root, st = { v: "whole", mode: "learn", pins: true, sel: null, test: null };
  function views() { if (!VIEWS.whole) { VIEWS.whole = whole(); VIEWS.fore = fore(); VIEWS.hind = hind(); } return VIEWS; }
  function prim(p, pass) {
    if (p.t === "l") return '<path class="' + pass + ' ln" d="' + p.d + '" ' + 'style="stroke-width:' + (pass === "o" ? p.w + 3.4 : p.w) + 'px"' + "/>";
    if (p.t === "c") return '<circle class="' + pass + '" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="' + f1(p.r) + '"/>';
    if (p.t === "e") return '<ellipse class="' + pass + '" cx="' + p.x + '" cy="' + p.y + '" rx="' + p.rx + '" ry="' + p.ry + '"' + (p.rot ? ' transform="rotate(' + p.rot + " " + p.x + " " + p.y + ')"' : "") + "/>";
    return '<path class="' + pass + '" d="' + p.d + '"/>';
  }
  function svg(v) {
    var o = "", labels = "", pins = "";
    v.bones.forEach(function (b) {
      o += '<g class="skB" data-b="' + b.id + '" tabindex="0" role="button" aria-label="' + esc(b.name) + '">' + b.prims.map(function (p) { return prim(p, "o"); }).join("") + b.prims.map(function (p) { return prim(p, "f"); }).join("") + "</g>";
      if (st.mode === "learn" && b.l) {
        var an = b.l[2] === "s" ? "start" : (b.l[2] === "e" ? "end" : "middle"), lx = b.l[0], ly = b.l[1];
        var tx = b.a[0], ty = b.a[1], ex = lx + (an === "start" ? 0 : (an === "end" ? 0 : 0));
        labels += '<g class="skLb" data-b="' + b.id + '"><path class="skLd" d="M' + f1(an === "start" ? lx + b.name.length * 6.6 + 4 : (an === "end" ? lx - b.name.length * 6.6 - 4 : lx)) + "," + (an === "middle" ? (ly < 200 ? ly + 6 : ly - 14) : ly - 4) + "L" + f1(tx) + "," + f1(ty) + '"/><circle class="skLp" cx="' + f1(tx) + '" cy="' + f1(ty) + '" r="2.6"/><text x="' + lx + '" y="' + ly + '" text-anchor="' + an + '">' + esc(b.name) + "</text></g>";
      }
    });
    if (st.pins && st.mode !== "test") v.pins.forEach(function (p, i) { pins += '<g class="skPin" data-p="' + i + '" tabindex="0" role="button" aria-label="Landmark: ' + esc(p.n) + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="8"/><path d="M' + (p.x - 3.5) + "," + p.y + "h7M" + p.x + "," + (p.y - 3.5) + 'v7"/></g>'; });
    return '<svg class="skSvg" viewBox="0 0 ' + v.vb[0] + " " + v.vb[1] + '" role="img" aria-label="' + esc(v.title) + '"><line class="skGr" x1="10" x2="' + (v.vb[0] - 10) + '" y1="' + (v.ground + 4) + '" y2="' + (v.ground + 4) + '"/>' + o + labels + pins + "</svg>";
  }
  function card() {
    var v = views()[st.v];
    if (st.mode === "test") return testCard(v);
    if (st.sel && st.sel.p != null) { var p = v.pins[st.sel.p]; return '<div class="skInfo"><span class="skTag">Palpable landmark</span><h3>' + esc(p.n) + "</h3><p>" + esc(p.h) + "</p></div>"; }
    if (st.sel && st.sel.b) { var b = bone(v, st.sel.b); return '<div class="skInfo"><span class="skTag">' + esc(v.title) + "</span><h3>" + esc(b.name) + "</h3><p>" + esc(b.f) + "</p></div>"; }
    return '<div class="skInfo"><p class="meta">Tap any bone to read about it.' + (st.pins ? " The ringed + marks are landmarks you can feel on a live dog." : "") + "</p></div>";
  }
  function bone(v, id) { for (var i = 0; i < v.bones.length; i++) if (v.bones[i].id === id) return v.bones[i]; }

  /* ----- test mode ----- */
  function startTest() {
    var v = views()[st.v], n = Math.min(10, v.bones.length);
    st.test = { ids: shuf(v.bones.map(function (b) { return b.id; })).slice(0, n), i: 0, score: 0, miss: [], done: false, lock: null };
  }
  function testCard(v) {
    var t = st.test; if (!t) { startTest(); t = st.test; }
    if (t.done) {
      return '<div class="skInfo"><span class="skTag">Test finished</span><h3>' + t.score + " / " + t.ids.length + "</h3>" + (t.miss.length ? "<p>Revise: " + t.miss.map(function (id) { return "<b>" + esc(bone(v, id).name) + "</b>"; }).join(", ") + ".</p>" : "<p>All correct. Nice.</p>") + '<div class="row"><button class="btn" type="button" data-act="again">Try again</button><button class="btn ghost" type="button" data-act="learn">Back to learning</button></div></div>';
    }
    var b = bone(v, t.ids[t.i]);
    return '<div class="skInfo"><span class="skTag">Question ' + (t.i + 1) + " of " + t.ids.length + " &middot; score " + t.score + "</span><h3>Tap the " + esc(b.name) + "</h3>" +
      (t.lock ? "<p>" + (t.lock.ok ? "Correct." : "Not quite. That was the " + esc(bone(v, t.lock.pick).name) + ". The " + esc(b.name) + " is highlighted.") + " " + esc(b.f) + '</p><div class="row"><button class="btn" type="button" data-act="next">' + (t.i + 1 < t.ids.length ? "Next" : "See result") + "</button></div>" : '<p class="meta">Labels are hidden. Tap the bone in the picture.</p>') + "</div>";
  }

  /* ----- render ----- */
  function draw() {
    var v = views()[st.v];
    var tabs = VORDER.map(function (id) { return '<button type="button" class="skTab' + (id === st.v ? " on" : "") + '" data-v="' + id + '">' + esc(VIEWS[id].title) + "</button>"; }).join("");
    var modes = [["learn", "Labels on"], ["clean", "Labels off"], ["test", "Test me"]].map(function (m) { return '<button type="button" class="skMode' + (m[0] === st.mode ? " on" : "") + '" data-m="' + m[0] + '">' + m[1] + "</button>"; }).join("");
    root.innerHTML = '<div class="skBar"><div class="skTabs" role="tablist">' + tabs + '</div><div class="skTabs">' + modes + '</div><label class="skChk"><input type="checkbox" data-pins ' + (st.pins ? "checked" : "") + "> Show palpable landmarks</label></div>" +
      '<div class="card skFig v-' + v.id + '" id="skFig">' + svg(v) + "</div>" + '<div class="card" id="skCard" aria-live="polite">' + card() + "</div>" +
      '<p class="meta">These are simplified teaching diagrams of the adult dog, not a scan. Compare with your anatomy atlas and your own dissection notes.</p>';
    paint();
  }
  function paint() {
    var fig = root.querySelector("#skFig"); if (!fig) return;
    var t = st.test, v = views()[st.v];
    [].forEach.call(fig.querySelectorAll(".skB"), function (g) {
      var id = g.getAttribute("data-b"), c = "skB";
      if (st.mode === "test" && t && t.lock) { if (id === t.ids[t.i]) c += " good"; else if (id === t.lock.pick) c += " bad"; }
      else if (st.mode !== "test" && st.sel && st.sel.b === id) c += " sel";
      g.setAttribute("class", c);
    });
    [].forEach.call(fig.querySelectorAll(".skLb"), function (g) { g.setAttribute("class", "skLb" + (st.sel && st.sel.b === g.getAttribute("data-b") ? " sel" : "")); });
    var cd = root.querySelector("#skCard"); if (cd) cd.innerHTML = card();
  }
  function onClick(e) {
    var a = e.target.closest("[data-act],[data-v],[data-m],.skB,.skPin,.skLb"); if (!a) return;
    if (a.dataset.v) { st.v = a.dataset.v; st.sel = null; st.test = null; history.replaceState(null, "", "#diagrams/" + st.v); return draw(); }
    if (a.dataset.m) { st.mode = a.dataset.m; st.sel = null; st.test = null; return draw(); }
    if (a.dataset.act) {
      var t = st.test;
      if (a.dataset.act === "again") { startTest(); return paint(); }
      if (a.dataset.act === "learn") { st.mode = "learn"; st.test = null; return draw(); }
      if (a.dataset.act === "next") { if (t.i + 1 >= t.ids.length) t.done = true; else { t.i++; } t.lock = null; return paint(); }
    }
    var gb = a.classList.contains("skLb") ? a.getAttribute("data-b") : (a.classList.contains("skB") ? a.getAttribute("data-b") : null);
    if (st.mode === "test") {
      var t2 = st.test; if (!t2 || t2.done || t2.lock || !a.classList.contains("skB")) return;
      var want = t2.ids[t2.i], ok = gb === want; t2.lock = { ok: ok, pick: gb }; if (ok) t2.score++; else if (t2.miss.indexOf(want) < 0) t2.miss.push(want);
      return paint();
    }
    if (a.classList.contains("skPin")) st.sel = { p: +a.getAttribute("data-p") }; else if (gb) st.sel = { b: gb };
    paint();
  }
  function onKey(e) { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(".skB,.skPin")) { e.preventDefault(); onClick({ target: e.target }); } }
  function mount() {
    var main = document.getElementById("main"); if (!main || document.getElementById("page-diagrams")) return;
    var sec = document.createElement("section"); sec.className = "page"; sec.id = "page-diagrams";
    sec.innerHTML = '<h1>Diagrams</h1><p class="meta">Skeletal system of the dog. Tap a bone, then switch labels off and test yourself.</p><div id="skBody"></div>';
    main.appendChild(sec); root = sec.querySelector("#skBody");
    var nav = document.getElementById("nav");
    if (nav && !nav.querySelector('a[href="#diagrams"]')) { var a = document.createElement("a"); a.href = "#diagrams"; a.textContent = "Diagrams"; var m = nav.querySelector('a[href="#mock"]') || nav.querySelector('a[href="#quiz"]'); if (m && m.nextSibling) nav.insertBefore(a, m.nextSibling); else nav.appendChild(a); }
    var cta = document.querySelector("#page-home .cta");
    if (cta && !cta.querySelector('a[href="#diagrams"]')) { var b = document.createElement("a"); b.className = "btn ghost"; b.href = "#diagrams"; b.textContent = "Skeleton diagrams"; cta.appendChild(b); }
    root.addEventListener("click", onClick); root.addEventListener("keydown", onKey);
    root.addEventListener("change", function (e) { if (e.target.hasAttribute("data-pins")) { st.pins = e.target.checked; draw(); } });
    if (typeof routes === "object") routes.diagrams = function (arg) { if (arg && VORDER.indexOf(arg) > -1 && arg !== st.v) { st.v = arg; st.sel = null; st.test = null; } draw(); };
    if (location.hash.indexOf("#diagrams") === 0 && typeof route === "function") route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();