/* VetNet Diagrams: skeleton views plus a diagram for every subject. Add-on file, does not change script.js. */
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

  /* ================= MORE DIAGRAMS (one or more per subject) ================= */
  /* Process diagram: nodes are [name, fact, clue]. layout "snake" (rows, zig-zag) or "cycle". */
  var FLOWS = [
    { id: "heart", subj: "phys", title: "Blood flow through the heart", layout: "snake", cols: 4,
      note: "After the venae cavae, the blood goes back to the right atrium, so the circuit repeats.",
      nodes: [
        ["Right atrium", "Receives deoxygenated blood from the cranial and caudal venae cavae and the coronary sinus.", "Receives blood from the venae cavae"],
        ["Tricuspid (right AV) valve", "Three cusps. Stops blood flowing back from the right ventricle into the right atrium.", "Valve between the right atrium and right ventricle"],
        ["Right ventricle", "Pumps blood to the lungs at low pressure, so its wall is thinner than the left.", "Pumps blood to the lungs"],
        ["Pulmonary (semilunar) valve", "Sits between the right ventricle and the pulmonary trunk.", "Valve at the start of the pulmonary trunk"],
        ["Lungs", "Gas exchange: CO2 leaves the blood, O2 enters it.", "Where gas exchange happens"],
        ["Pulmonary veins", "Carry oxygenated blood to the left atrium. They are the veins that carry oxygenated blood.", "Veins that carry oxygenated blood"],
        ["Left atrium", "Receives oxygenated blood from the pulmonary veins.", "Receives blood from the pulmonary veins"],
        ["Mitral (left AV) valve", "Two cusps (bicuspid). Myxomatous mitral valve disease is a common heart disease of older small-breed dogs.", "Valve with two cusps between left atrium and left ventricle"],
        ["Left ventricle", "Thickest wall. Pumps blood to the whole body at high pressure.", "Has the thickest muscular wall"],
        ["Aortic (semilunar) valve", "Sits between the left ventricle and the aorta.", "Valve at the start of the aorta"],
        ["Aorta and body (systemic circulation)", "Delivers oxygenated blood to the tissues through arteries, arterioles and capillaries.", "Carries oxygenated blood to the body"],
        ["Venae cavae", "Return deoxygenated blood from the body to the right atrium.", "Return blood from the body to the heart"]
      ] },
    { id: "energy", subj: "bioc", title: "Glucose to ATP (overview)", layout: "snake", cols: 4,
      note: "A simple overview of energy metabolism. In ruminants most glucose is made by gluconeogenesis, because rumen microbes ferment carbohydrates to volatile fatty acids.",
      nodes: [
        ["Glucose (6 carbons)", "The main fuel for most tissues. The brain depends heavily on it.", "The starting six-carbon fuel"],
        ["Glycolysis (cytosol)", "Glucose to 2 pyruvate. Net gain 2 ATP and 2 NADH. It needs no oxygen.", "Happens in the cytosol and gives a net 2 ATP"],
        ["Pyruvate (3 carbons)", "Becomes lactate when oxygen is short. With oxygen it enters the mitochondrion.", "Becomes lactate when oxygen is short"],
        ["Acetyl-CoA", "Made by pyruvate dehydrogenase in the mitochondrial matrix. It releases CO2 and NADH, and needs thiamine (vitamin B1).", "Made by pyruvate dehydrogenase, which needs thiamine"],
        ["TCA (Krebs) cycle", "In the mitochondrial matrix. Per acetyl-CoA: 3 NADH, 1 FADH2, 1 GTP and 2 CO2.", "Gives 3 NADH, 1 FADH2 and 1 GTP per acetyl-CoA"],
        ["Electron transport chain", "On the inner mitochondrial membrane. Oxygen is the final electron acceptor. Most ATP is made here (oxidative phosphorylation).", "Oxygen is the final electron acceptor"],
        ["ATP (about 30 to 32 per glucose)", "Modern textbooks give about 30 to 32 ATP per glucose. Older books say 36 to 38.", "The overall yield per glucose"]
      ] },
    { id: "adme", subj: "pharm", title: "What the body does to a drug (ADME)", layout: "snake", cols: 3,
      note: "Pharmacokinetics in five steps. Theory only.",
      nodes: [
        ["Administration", "Routes: oral, intravenous, intramuscular, subcutaneous, topical. The intravenous route gives 100% bioavailability.", "The route by which the drug enters the body"],
        ["Absorption", "The drug moves from the site of administration into the blood. It depends on the route, lipid solubility and pH.", "The drug moves from the site of administration into blood"],
        ["Distribution", "The drug goes from blood to the tissues. Plasma protein binding, blood flow and barriers such as the blood-brain barrier matter.", "The drug moves from blood to tissues"],
        ["Metabolism (biotransformation)", "Mainly in the liver: phase I (oxidation, cytochrome P450) and phase II (conjugation, e.g. glucuronidation). Cats are poor at glucuronidation, so they are sensitive to paracetamol.", "Mainly in the liver; cats are poor at glucuronidation"],
        ["Excretion", "Mainly by the kidney. Also bile, milk and lungs. Excretion in milk and tissue residues is why withdrawal periods matter in food animals.", "Removal of the drug and its metabolites, mainly by the kidney"]
      ] },
    { id: "fasc", subj: "para", title: "Life cycle of Fasciola (liver fluke)", layout: "cycle",
      note: "Fasciola needs a snail intermediate host, so snail control and fencing off wet pastures help to break the cycle.",
      nodes: [
        ["Adult fluke in bile ducts", "Final hosts: cattle, buffalo, sheep and goats. It causes fascioliasis (liver fluke disease).", "The adult stage, in the bile ducts of the final host"],
        ["Eggs passed in faeces", "Operculated, yellowish-brown eggs. They need water to develop and hatch.", "Eggs leave the host in the faeces"],
        ["Miracidium", "A free-swimming ciliated larva that hatches in water and penetrates a snail.", "Ciliated larva that hatches in water and finds a snail"],
        ["Snail (Lymnaea) stages", "Lymnaea snails are the intermediate host. Sporocyst, redia and cercaria develop inside.", "Intermediate host where sporocyst and redia develop"],
        ["Cercaria", "A tailed larva that leaves the snail and swims to vegetation.", "Tailed larva that leaves the snail"],
        ["Metacercaria on grass", "The encysted, infective stage on plants or in water. Animals are infected by swallowing it.", "The infective stage, found encysted on grass"],
        ["Young fluke migrates in the liver", "The young flukes burrow through the intestinal wall and liver tissue to the bile ducts. This causes the acute damage.", "Burrows through the liver tissue and reaches the bile ducts"]
      ] },
    { id: "inflam", subj: "path", title: "Acute inflammation: sequence", layout: "snake", cols: 4,
      note: "Cardinal signs: rubor (redness), calor (heat), tumor (swelling) and dolor (pain). Virchow added functio laesa (loss of function).",
      nodes: [
        ["Injury or infection", "Tissue damage or microbes trigger the response through chemical mediators such as histamine.", "The trigger"],
        ["Vasodilation", "Arterioles dilate and blood flow rises. This causes redness (rubor) and heat (calor).", "Causes redness and heat"],
        ["Increased vascular permeability", "Fluid and protein leak out of venules, forming exudate and causing swelling (tumor).", "Leakage of protein-rich fluid causes swelling"],
        ["Margination and rolling", "Neutrophils slow down, roll along the vessel wall and stick to it (selectins and integrins).", "Neutrophils slow and stick to the vessel wall"],
        ["Emigration (diapedesis)", "White cells squeeze between endothelial cells and leave the vessel.", "White cells leave the vessel through its wall"],
        ["Chemotaxis and phagocytosis", "Cells move along a chemical gradient to the site and engulf and kill microbes.", "Cells follow chemical signals and engulf microbes"],
        ["Outcome", "Resolution and repair, abscess formation, or progression to chronic inflammation.", "Resolution, abscess or chronic inflammation"]
      ] },
    { id: "prox", subj: "nutr", title: "Proximate analysis of feed (Weende)", layout: "snake", cols: 4,
      note: "The proximate principles are moisture, ash, crude protein, ether extract, crude fibre and nitrogen-free extract.",
      nodes: [
        ["Feed sample", "A representative, ground sample is the start. A poor sample ruins every later result.", "The starting material"],
        ["Moisture (oven drying)", "Dried in a hot-air oven at about 100 to 105 degrees C. The loss in weight is moisture. What remains is dry matter.", "Oven drying gives this and then dry matter"],
        ["Ash (muffle furnace)", "Burn the sample at about 550 to 600 degrees C. The residue is total ash (minerals).", "Burning in a muffle furnace gives this"],
        ["Crude protein (Kjeldahl)", "Nitrogen is measured and multiplied by 6.25, since protein is about 16% nitrogen.", "Nitrogen multiplied by 6.25"],
        ["Ether extract (Soxhlet)", "Fat is extracted with ether in a Soxhlet apparatus.", "Extracted with ether in a Soxhlet apparatus"],
        ["Crude fibre", "Residue left after boiling in dilute acid and then dilute alkali. It is mostly cellulose and lignin.", "Residue after acid and then alkali digestion"],
        ["Nitrogen-free extract (NFE)", "Found by difference: 100 minus (moisture + ash + CP + EE + CF). It mostly represents soluble carbohydrates.", "Calculated by difference, not measured"]
      ] },
    { id: "chain", subj: "pubh", title: "Chain of infection (zoonosis example: rabies)", layout: "cycle",
      note: "Break any link in the chain and transmission stops.",
      nodes: [
        ["Infectious agent", "The organism: bacteria, virus, parasite or fungus. Example: rabies virus.", "The disease-causing organism"],
        ["Reservoir", "Where the agent lives and multiplies. For rabies in India: dogs (and wildlife).", "Where the agent normally lives"],
        ["Portal of exit", "The way the agent leaves the reservoir. Rabies: saliva.", "The way the agent leaves the reservoir"],
        ["Mode of transmission", "Direct (bite), indirect (fomites, vectors, food, water) or airborne. Rabies: bite.", "How the agent travels to the new host"],
        ["Portal of entry", "How the agent enters the new host. Rabies: a bite wound or broken skin.", "How the agent enters the new host"],
        ["Susceptible host", "An unvaccinated animal or person. Vaccination of dogs and post-exposure prophylaxis protect hosts.", "Someone without immunity who can become infected"]
      ] },
    { id: "mendel", subj: "gen", title: "Monohybrid cross (Mendel)", layout: "snake", cols: 3,
      note: "Mendel's pea experiment. T = tall (dominant), t = dwarf (recessive).",
      nodes: [
        ["Parents: TT (tall) x tt (dwarf)", "Pure lines. Each parent gives one allele, so every F1 plant is Tt.", "Pure tall crossed with pure dwarf"],
        ["F1: all Tt, all tall", "Genotype Tt, phenotype tall. The dwarf trait is hidden but not lost. This shows dominance.", "Every F1 plant is tall but carries the hidden allele"],
        ["F1 x F1: Tt x Tt", "Gametes: T and t from each parent (law of segregation).", "Cross between two F1 plants"],
        ["F2 phenotype: 3 tall : 1 dwarf", "The classical monohybrid phenotypic ratio.", "The phenotypic ratio in F2"],
        ["F2 genotype: 1 TT : 2 Tt : 1 tt", "The genotypic ratio in F2.", "The genotypic ratio in F2"],
        ["Test cross: Tt x tt gives 1 : 1", "A cross with the recessive parent shows whether a dominant-looking individual is TT or Tt. If Tt, offspring are 1 tall : 1 dwarf.", "Cross with the recessive parent to find the genotype"]
      ] },
    { id: "dairy", subj: "lpm", title: "Dairy cow: production cycle", layout: "cycle",
      note: "Aim for a calving interval of about 12 to 13 months.",
      nodes: [
        ["Calving", "The start of a new lactation. Provide a clean, dry calving area and watch for retained placenta.", "Start of the new lactation"],
        ["Colostrum feeding", "The calf needs colostrum as early as possible (best within the first hours). It gives antibodies, because calves are born with almost none.", "First milk, rich in antibodies, for the newborn calf"],
        ["Peak lactation", "Milk yield peaks some weeks after calving (roughly weeks 4 to 8). Feed a high-energy ration.", "Milk yield is highest here"],
        ["Breeding (rebreeding)", "The cow is bred again after the voluntary waiting period (often around 60 days). Heat detection is key.", "The cow is inseminated again"],
        ["Late lactation", "Milk yield declines while the cow is pregnant.", "Milk yield declines during pregnancy"],
        ["Dry period", "About 60 days without milking. It lets the udder tissue renew and the cow rebuild body condition.", "Rest from milking before the next calving"]
      ] },
    { id: "milk", subj: "lpt", title: "Market milk processing line", layout: "snake", cols: 4,
      note: "The alkaline phosphatase test checks that milk was properly pasteurised.",
      nodes: [
        ["Reception and testing", "Platform tests: temperature, acidity, clot-on-boiling or alcohol test, and adulterants. Weigh and sample.", "Platform tests on arriving milk"],
        ["Filtration and clarification", "Removes visible dirt and cells with a filter or a clarifier (centrifuge).", "Removes visible dirt and sediment"],
        ["Standardisation", "Adjusts fat and SNF to the required level.", "Adjusting fat and SNF"],
        ["Homogenisation", "Breaks fat globules into smaller ones under high pressure, preventing cream line formation.", "Breaks up the fat globules"],
        ["Pasteurisation", "HTST: 72 degrees C for 15 seconds. LTLT (holder): 63 degrees C for 30 minutes. It kills non-spore pathogens.", "HTST 72 degrees C for 15 seconds"],
        ["Cooling", "Cool quickly to about 4 to 5 degrees C to prevent growth of surviving bacteria.", "Rapid chilling to about 4 to 5 degrees C"],
        ["Packaging and cold storage", "Fill into clean pouches or bottles, then keep in the cold chain until sold.", "Filling and keeping in the cold chain"]
      ] },
    { id: "estrous", subj: "gyn", title: "Bovine oestrous cycle (about 21 days)", layout: "cycle",
      note: "The cow is polyoestrous, so she cycles all year. The usual cycle length is about 21 days (18 to 24).",
      nodes: [
        ["Pro-oestrus", "Follicles grow and oestrogen rises. The cow begins to show interest in other cows.", "Follicle growth and rising oestrogen"],
        ["Oestrus (heat)", "Standing to be mounted. The LH surge occurs. Heat lasts about 12 to 18 hours.", "The cow stands to be mounted"],
        ["Met-oestrus", "Ovulation occurs about 10 to 14 hours after the end of heat. The corpus luteum starts to form. There may be a bloody mucus discharge.", "Ovulation and early corpus luteum formation"],
        ["Dioestrus", "The longest phase. The corpus luteum is mature and secretes progesterone.", "The longest phase, with progesterone dominant"],
        ["Luteolysis", "If the cow is not pregnant, the uterus releases PGF2 alpha and the corpus luteum regresses, so a new cycle starts.", "PGF2 alpha makes the corpus luteum regress"]
      ] },
    { id: "wound", subj: "surg", title: "Phases of wound healing", layout: "snake", cols: 4,
      note: "First intention: a clean, sutured wound. Second intention: an open wound that heals by granulation and contraction.",
      nodes: [
        ["Haemostasis", "Immediate. Vasoconstriction and a platelet plug and fibrin clot stop bleeding.", "Stopping the bleeding"],
        ["Inflammatory phase", "Roughly the first few days. Neutrophils then macrophages clean the wound (debridement).", "Neutrophils and macrophages clean the wound"],
        ["Proliferative phase", "Fibroblasts lay down collagen, new capillaries form granulation tissue, and the wound edges contract and epithelialise.", "Granulation tissue forms and the wound contracts"],
        ["Maturation (remodelling)", "Starts around weeks 2 to 3 and can last for months. Collagen is reorganised. The scar reaches about 80% of normal skin strength.", "The scar is remodelled and gets stronger"]
      ] },
    { id: "milkfever", subj: "med", title: "Milk fever (parturient hypocalcaemia) in cows", layout: "snake", cols: 4,
      note: "Treatment is an emergency. Give calcium borogluconate slowly and listen to the heart while giving it.",
      nodes: [
        ["Calving and start of lactation", "Most cases occur within 1 to 3 days after calving, mainly in high-yielding older dairy cows.", "The time of risk"],
        ["Calcium drains into colostrum", "Colostrum removes more calcium than the cow can mobilise from bone and gut.", "Calcium is lost into the first milk"],
        ["Blood calcium falls", "Hypocalcaemia reduces nerve and muscle function, including the smooth muscle of the gut and the heart.", "Low blood calcium"],
        ["Stage 1", "Restless, excitable, tremors, stiff gait and loss of appetite.", "Excited, tremor, stiff gait; still standing"],
        ["Stage 2", "Cannot stand. Sternal recumbency with the head turned into the flank (S-shaped neck), cold ears and legs, dry muzzle.", "Sternal recumbency with S-shaped neck"],
        ["Stage 3", "Lateral recumbency, bloat, weak pulse, coma and death if untreated.", "Lateral recumbency and coma"],
        ["Treatment", "Slow intravenous calcium borogluconate (for example 20 to 25 percent solution), then nurse the cow and prevent relapse.", "Slow intravenous calcium borogluconate"]
      ] },
    { id: "adoption", subj: "ext", title: "Stages of the adoption process", layout: "snake", cols: 5,
      note: "These are the classical stages. Rogers later renamed them knowledge, persuasion, decision, implementation and confirmation.",
      nodes: [
        ["Awareness", "The farmer first hears about a new practice, for example artificial insemination, but has little information.", "First hears about the new practice"],
        ["Interest", "The farmer seeks more information and asks questions.", "Seeks more information"],
        ["Evaluation", "The farmer mentally weighs the practice against his or her own situation: cost, benefit and risk.", "Weighs cost, benefit and risk mentally"],
        ["Trial", "The farmer tries it on a small scale, for example on one animal.", "Tries it on a small scale"],
        ["Adoption", "The farmer decides to use it fully and continues.", "Takes it up fully"]
      ] },
    { id: "adopters", subj: "ext", title: "Adopter categories (Rogers)", layout: "snake", cols: 5,
      note: "Percentages are Rogers' figures for a normally distributed population.",
      nodes: [
        ["Innovators (2.5%)", "Venturesome. They are the first to try new ideas, often have contacts outside the village.", "The first and most venturesome 2.5%"],
        ["Early adopters (13.5%)", "Respected opinion leaders. Others look to them for advice.", "Respected opinion leaders"],
        ["Early majority (34%)", "Deliberate. They adopt just before the average farmer.", "34% who adopt just before the average"],
        ["Late majority (34%)", "Sceptical. They adopt after most others, often because of pressure from peers.", "Sceptical 34% who adopt after the average"],
        ["Laggards (16%)", "Traditional, last to adopt, and they often look to the past.", "The last 16%, traditional"]
      ] },
    { id: "exam", subj: "clin", title: "Clinical examination: order of steps", layout: "snake", cols: 4,
      note: "A dog's normal rectal temperature is about 38.3 to 39.2 degrees C (101 to 102.5 degrees F).",
      nodes: [
        ["History (anamnesis)", "Ask the owner: signalment, vaccination, feeding, deworming, duration and course of the illness.", "Questions to the owner"],
        ["General examination", "Temperature, pulse, respiration, mucous membranes, hydration, body condition, lymph nodes.", "Temperature, pulse, respiration and mucous membranes"],
        ["Systemic examination", "System by system using inspection, palpation, percussion and auscultation.", "Inspection, palpation, percussion and auscultation by system"],
        ["Provisional diagnosis", "A working diagnosis and list of differentials from history and findings.", "A working diagnosis"],
        ["Laboratory and imaging", "Blood, faecal and urine tests, radiography or ultrasound to confirm the diagnosis.", "Tests that confirm the diagnosis"],
        ["Treatment and advice", "Treat, counsel the owner, and note any withdrawal periods in food animals.", "Treatment and owner advice"],
        ["Records", "Keep clear case records. They matter for follow-up, legal reasons and ethics.", "Keeping case records"]
      ] },
    { id: "biosec", subj: "farm", title: "Farm biosecurity routine", layout: "snake", cols: 3,
      note: "Prevention is cheaper than treatment. Keep the routine written and followed by all workers.",
      nodes: [
        ["Controlled entry", "Visitor register, footbath at the gate, vehicle disinfection and restricted access to animal sheds.", "Footbaths and a visitor register"],
        ["Quarantine of new animals", "Keep new stock separate, usually for 2 to 4 weeks, and observe and test before mixing.", "New animals are kept apart before joining the herd"],
        ["Vaccination and deworming", "Follow a written calendar for the area's common diseases and keep the records.", "Following a vaccination and deworming calendar"],
        ["Cleaning and disinfection", "Clean first, then disinfect, because dirt inactivates many disinfectants. Use all-in all-out in poultry and pigs.", "Clean first, then disinfect"],
        ["Waste and carcass disposal", "Burial, incineration or composting, away from water sources. Never leave carcasses in the open.", "Safe handling of dead animals and manure"],
        ["Health records and monitoring", "Daily observation, mortality and production records. Report unusual deaths early.", "Daily observation and records to detect disease early"]
      ] }
  ];

  /* Drawn diagrams (parts you tap) */
  function stomach() {
    return { id: "stomach", subj: "anat", title: "Ruminant stomach (left side)", vb: [900, 560], ground: 520, bones: [
      { id: "rumen", name: "Rumen", prims: [E(470, 270, 215, 150), E(420, 330, 120, 110)], a: [540, 230], l: [600, 70, "m"], f: "The largest compartment, about 80 percent of the stomach capacity. Home to bacteria, protozoa and fungi that ferment fibre to volatile fatty acids. It is divided into sacs by pillars." },
      { id: "reticulum", name: "Reticulum", prims: [C(228, 250, 54)], a: [228, 250], l: [100, 150, "s"], f: "Honeycomb lining. Lies against the diaphragm. Heavy objects such as nails settle here, causing traumatic reticuloperitonitis (hardware disease)." },
      { id: "omasum", name: "Omasum", prims: [C(300, 400, 48)], a: [300, 400], l: [120, 470, "s"], f: "Has many leaf-like laminae (manyplies). It absorbs water and volatile fatty acids from the digesta." },
      { id: "abomasum", name: "Abomasum", prims: [L("M336,418Q420,500 548,452", 44), C(552, 450, 18)], a: [450, 460], l: [450, 535, "m"], f: "The true (glandular) stomach. It secretes hydrochloric acid and pepsin. Displacement of the abomasum is a common problem in dairy cows." },
      { id: "oesoph", name: "Oesophagus", prims: [L("M150,60Q205,95 262,212", 14)], a: [190, 92], l: [20, 60, "s"], f: "Enters at the cardia, near the junction of the rumen and reticulum. In suckling calves the oesophageal (reticular) groove closes and sends milk straight to the abomasum." },
      { id: "duod", name: "Duodenum", prims: [L("M556,440Q640,430 700,470", 12)], a: [640, 442], l: [800, 470, "m"], f: "The first part of the small intestine. Bile and pancreatic juice enter here." }
    ], pins: [] };
  }
  function bacteria() {
    var rib = [], i, pil = [];
    var rp = [[270,230],[300,200],[350,192],[420,188],[500,192],[560,202],[620,222],[640,300],[620,340],[560,352],[480,356],[400,354],[330,346],[270,322],[258,272]]; rp.forEach(function (q) { rib.push(C(q[0], q[1] + 30, 5)); });
    for (i = 0; i < 6; i++) pil.push(L("M200," + (205 + i * 22) + "L" + (150 - (i % 2) * 14) + "," + (195 + i * 24), 3));
    return { id: "bacteria", subj: "micro", title: "Bacterial cell (rod-shaped)", vb: [900, 480], ground: 470, bones: [
      { id: "flag", name: "Flagellum", prims: [L("M700,280Q760,230 800,290T890,280", 5)], a: [770, 255], l: [700, 70, "m"], f: "A whip-like protein filament (flagellin) for movement. It forms the H antigen." },
      { id: "pili", name: "Pili (fimbriae)", prims: pil, a: [165, 235], l: [60, 70, "s"], f: "Short hairs that help the bacterium stick to host cells. The sex pilus is used in conjugation." },
      { id: "capsule", name: "Capsule", prims: [P(rr(188, 150, 520, 260, 130))], a: [200, 280], l: [430, 440, "m"], f: "A slimy outer layer, usually of polysaccharide. It protects against phagocytosis and is a virulence factor." },
      { id: "wall", name: "Cell wall", prims: [P(rr(206, 168, 484, 224, 112))], a: [215, 300], l: [110, 440, "m"], f: "Made of peptidoglycan. It is thick in Gram-positive bacteria and thin, with an outer membrane, in Gram-negative bacteria. Penicillins block its synthesis." },
      { id: "memb", name: "Cell membrane", prims: [P(rr(224, 184, 448, 192, 96))], a: [235, 290], l: [270, 440, "m"], f: "A phospholipid bilayer. It controls what enters and leaves. In bacteria it also carries the respiratory enzymes, since there are no mitochondria." },
      { id: "cyto", name: "Cytoplasm", prims: [P(rr(236, 194, 424, 172, 86))], a: [620, 280], l: [800, 440, "m"], f: "Contains ribosomes, the nucleoid and storage granules. There is no nuclear membrane or other membrane-bound organelle." },
      { id: "nucleoid", name: "Nucleoid", prims: [P("M380,250Q420,200 480,230Q540,250 560,290Q520,340 450,320Q390,320 380,250Z")], a: [470, 275], l: [480, 90, "m"], f: "The region with the single circular chromosome. Bacteria are prokaryotes: there is no nuclear membrane." },
      { id: "ribo", name: "Ribosomes (70S)", prims: rib.map(function (c) { return C(c.x, c.y - 30, 5); }), a: [320, 190], l: [320, 90, "m"], f: "Bacterial ribosomes are 70S (30S + 50S subunits). Many antibiotics, such as tetracyclines and aminoglycosides, target them." },
      { id: "plasmid", name: "Plasmid", prims: [C(590, 300, 22)], a: [590, 300], l: [620, 90, "m"], f: "A small circular piece of extra DNA. It often carries antibiotic-resistance genes and can pass to other bacteria by conjugation." }
    ], pins: [] };
  }
  var EXTRA = [stomach, bacteria];

  /* ================= ENGINE ================= */
  var VIEWS = {}, VORDER = ["whole", "fore", "hind"], FLOWSET = {}, root, st = { v: "whole", mode: "learn", pins: true, sel: null, test: null };
  function views() {
    if (!VIEWS.whole) {
      VIEWS.whole = whole(); VIEWS.fore = fore(); VIEWS.hind = hind(); ["whole", "fore", "hind"].forEach(function (k) { VIEWS[k].subj = "anat"; });
      EXTRA.forEach(function (fn) { var v = fn(); VIEWS[v.id] = v; VORDER.push(v.id); });
      FLOWS.forEach(function (d) { DEFS[d.id] = d; var v = flowView(d); VIEWS[v.id] = v; VORDER.push(v.id); });
    }
    return VIEWS;
  }
  var NARROW = {}, DEFS = {};
  function narrow() { return window.innerWidth < 700; }
  function V(id) { var v = views()[id]; if (v.kind === "flow" && narrow()) { if (!NARROW[id]) { var d = DEFS[id]; NARROW[id] = flowView({ id: d.id, subj: d.subj, title: d.title, note: d.note, nodes: d.nodes, layout: "snake", cols: 2 }); } return NARROW[id]; } return v; }
  function wrap(s, n) { var w = s.split(" "), out = [], cur = ""; w.forEach(function (x) { if ((cur + " " + x).trim().length > n && cur) { out.push(cur); cur = x; } else cur = (cur + " " + x).trim(); }); if (cur) out.push(cur); return out; }
  function flowView(d) {
    var W = 196, H = 70, GX = 64, GY = 58, M = 24, n = d.nodes.length, pos = [], vw, vh, i;
    if (d.layout === "cycle") {
      vw = 900; vh = n > 6 ? 640 : 600;
      var rx = (vw - W) / 2 - M, ry = (vh - H) / 2 - M;
      for (i = 0; i < n; i++) { var th = 2 * Math.PI * i / n; pos.push([vw / 2 + rx * Math.sin(th) - W / 2, vh / 2 - ry * Math.cos(th) - H / 2]); }
    } else {
      var cols = Math.min(d.cols || 4, n), rows = Math.ceil(n / cols);
      vw = cols * W + (cols - 1) * GX + 2 * M; vh = rows * H + (rows - 1) * GY + 2 * M;
      for (i = 0; i < n; i++) { var r = Math.floor(i / cols), c = i % cols; if (r % 2) c = cols - 1 - c; pos.push([M + c * (W + GX), M + r * (H + GY)]); }
    }
    var arrows = "";
    function arrow(a, b) {
      var ax = a[0] + W / 2, ay = a[1] + H / 2, bx = b[0] + W / 2, by = b[1] + H / 2, dx = bx - ax, dy = by - ay;
      var tx = dx ? (W / 2 + 7) / Math.abs(dx) : 9, ty = dy ? (H / 2 + 7) / Math.abs(dy) : 9, t = Math.min(tx, ty);
      arrows += '<path class="skAr" d="M' + f1(ax + dx * t) + "," + f1(ay + dy * t) + "L" + f1(bx - dx * t) + "," + f1(by - dy * t) + '" marker-end="url(#skHead)"/>';
    }
    for (i = 0; i < n - 1; i++) arrow(pos[i], pos[i + 1]);
    if (d.layout === "cycle") arrow(pos[n - 1], pos[0]);
    var bones = d.nodes.map(function (nd, k) {
      return { id: "n" + k, name: nd[0], f: nd[1], q: nd[2], prims: [P(rr(pos[k][0], pos[k][1], W, H, 14))], node: { x: pos[k][0], y: pos[k][1], w: W, h: H, i: k + 1, lines: wrap(nd[0], 26) } };
    });
    return { id: d.id, subj: d.subj, title: d.title, kind: "flow", vb: [vw, vh], bones: bones, pins: [], arrows: arrows, note: d.note, ground: -50 };
  }
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
    var ft = "";
    if (v.kind === "flow" && st.mode !== "clean") v.bones.forEach(function (b) {
      var nd = b.node, ty = nd.y + nd.h / 2 - (nd.lines.length - 1) * 8.5 + 5;
      ft += '<g class="skNt" data-b="' + b.id + '"><circle cx="' + (nd.x + 2) + '" cy="' + (nd.y + 2) + '" r="11"/><text class="skNn" x="' + (nd.x + 2) + '" y="' + (nd.y + 6) + '" text-anchor="middle">' + nd.i + "</text>" + nd.lines.map(function (ln, j) { return '<text x="' + (nd.x + nd.w / 2) + '" y="' + (ty + j * 17) + '" text-anchor="middle">' + esc(ln) + "</text>"; }).join("") + "</g>";
    });
    if (st.pins && st.mode !== "test") v.pins.forEach(function (p, i) { pins += '<g class="skPin" data-p="' + i + '" tabindex="0" role="button" aria-label="Landmark: ' + esc(p.n) + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="8"/><path d="M' + (p.x - 3.5) + "," + p.y + "h7M" + p.x + "," + (p.y - 3.5) + 'v7"/></g>'; });
    return '<svg class="skSvg" viewBox="0 0 ' + v.vb[0] + " " + v.vb[1] + '" role="img" aria-label="' + esc(v.title) + '"><defs><marker id="skHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="skAh"/></marker></defs>' + (v.ground > 0 ? '<line class="skGr" x1="10" x2="' + (v.vb[0] - 10) + '" y1="' + (v.ground + 4) + '" y2="' + (v.ground + 4) + '"/>' : "") + (v.arrows || "") + o + ft + labels + pins + "</svg>";
  }
  function card() {
    var v = V(st.v);
    if (st.mode === "test") return testCard(v);
    if (st.sel && st.sel.p != null) { var p = v.pins[st.sel.p]; return '<div class="skInfo"><span class="skTag">Palpable landmark</span><h3>' + esc(p.n) + "</h3><p>" + esc(p.h) + "</p></div>"; }
    if (st.sel && st.sel.b) { var b = bone(v, st.sel.b); return '<div class="skInfo"><span class="skTag">' + esc(v.title) + "</span><h3>" + esc(b.name) + "</h3><p>" + esc(b.f) + "</p></div>"; }
    return '<div class="skInfo"><p class="meta">Tap any ' + (v.kind === "flow" ? "box" : "part") + " to read about it." + (v.pins.length && st.pins ? " The ringed + marks are landmarks you can feel on a live dog." : "") + (v.note ? " " + esc(v.note) : "") + "</p></div>";
  }
  function bone(v, id) { for (var i = 0; i < v.bones.length; i++) if (v.bones[i].id === id) return v.bones[i]; }

  /* ----- test mode ----- */
  function startTest() {
    var v = V(st.v), n = Math.min(10, v.bones.length);
    st.test = { ids: shuf(v.bones.map(function (b) { return b.id; })).slice(0, n), i: 0, score: 0, miss: [], done: false, lock: null };
  }
  function testCard(v) {
    var t = st.test; if (!t) { startTest(); t = st.test; }
    if (t.done) {
      return '<div class="skInfo"><span class="skTag">Test finished</span><h3>' + t.score + " / " + t.ids.length + "</h3>" + (t.miss.length ? "<p>Revise: " + t.miss.map(function (id) { return "<b>" + esc(bone(v, id).name) + "</b>"; }).join(", ") + ".</p>" : "<p>All correct. Nice.</p>") + '<div class="row"><button class="btn" type="button" data-act="again">Try again</button><button class="btn ghost" type="button" data-act="learn">Back to learning</button></div></div>';
    }
    var b = bone(v, t.ids[t.i]);
    return '<div class="skInfo"><span class="skTag">Question ' + (t.i + 1) + " of " + t.ids.length + " &middot; score " + t.score + "</span><h3>Tap the " + esc(b.name) + "</h3>" +
      (t.lock ? "<p>" + (t.lock.ok ? "Correct." : "Not quite. That was the " + esc(bone(v, t.lock.pick).name) + ". The " + esc(b.name) + " is highlighted.") + " " + esc(b.f) + '</p><div class="row"><button class="btn" type="button" data-act="next">' + (t.i + 1 < t.ids.length ? "Next" : "See result") + "</button></div>" : '<p class="meta">' + (v.kind === "flow" ? "Tap the matching box." : "Labels are hidden. Tap the part in the picture.") + "</p>") + "</div>";
  }

  /* ----- render ----- */
  function draw() {
    var v = V(st.v);
    var groups = {}, gl = [];
    VORDER.forEach(function (id) { var s = VIEWS[id].subj; if (!groups[s]) { groups[s] = []; gl.push(s); } groups[s].push(id); });
    if (typeof ORDER !== "undefined" && typeof SUBJECTS !== "undefined") gl.sort(function (a, b) { var ia = -1, ib = -1; SUBJECTS.forEach(function (x, i) { if (x.id === a) ia = i; if (x.id === b) ib = i; }); return ia - ib; });
    var tabs = '<select class="skSel" data-sel aria-label="Choose a diagram">' + gl.map(function (s) { return '<optgroup label="' + esc(typeof SUBJ !== "undefined" && SUBJ[s] ? SUBJ[s].name : s) + '">' + groups[s].map(function (id) { return '<option value="' + id + '"' + (id === st.v ? " selected" : "") + ">" + esc(VIEWS[id].title) + "</option>"; }).join("") + "</optgroup>"; }).join("") + "</select>";
    var modes = [["learn", "Labels on"], ["clean", "Labels off"], ["test", "Test me"]].map(function (m) { return '<button type="button" class="skMode' + (m[0] === st.mode ? " on" : "") + '" data-m="' + m[0] + '">' + m[1] + "</button>"; }).join("");
    root.innerHTML = '<div class="skBar"><div class="skTabs" role="tablist">' + tabs + '</div><div class="skTabs">' + modes + '</div><label class="skChk"><input type="checkbox" data-pins ' + (st.pins ? "checked" : "") + "> Show palpable landmarks</label></div>" +
      '<div class="card skFig v-' + v.id + '" id="skFig">' + svg(v) + "</div>" + '<div class="card" id="skCard" aria-live="polite">' + card() + "</div>" +
      '<p class="meta">These are simplified teaching diagrams, not exact drawings. Compare with your textbook, atlas and class notes.</p>';
    paint();
  }
  function paint() {
    var fig = root.querySelector("#skFig"); if (!fig) return;
    var t = st.test, v = V(st.v);
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
    sec.innerHTML = '<h1>Diagrams</h1><p class="meta">Pick a subject diagram. Tap any part to read about it, then test yourself.</p><div id="skBody"></div>';
    main.appendChild(sec); root = sec.querySelector("#skBody");
    var nav = document.getElementById("nav");
    if (nav && !nav.querySelector('a[href="#diagrams"]')) { var a = document.createElement("a"); a.href = "#diagrams"; a.textContent = "Diagrams"; var m = nav.querySelector('a[href="#mock"]') || nav.querySelector('a[href="#quiz"]'); if (m && m.nextSibling) nav.insertBefore(a, m.nextSibling); else nav.appendChild(a); }
    var cta = document.querySelector("#page-home .cta");
    if (cta && !cta.querySelector('a[href="#diagrams"]')) { var b = document.createElement("a"); b.className = "btn ghost"; b.href = "#diagrams"; b.textContent = "Skeleton diagrams"; cta.appendChild(b); }
    var wasN = narrow(), rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (narrow() !== wasN) { wasN = narrow(); if (sec.classList.contains("active")) draw(); } }, 200); });
    root.addEventListener("click", onClick); root.addEventListener("keydown", onKey);
    root.addEventListener("change", function (e) { if (e.target.hasAttribute("data-sel")) { st.v = e.target.value; st.sel = null; st.test = null; try { history.replaceState(null, "", "#diagrams/" + st.v); } catch (x) {} return draw(); } if (e.target.hasAttribute("data-pins")) { st.pins = e.target.checked; draw(); } });
    if (typeof routes === "object") routes.diagrams = function (arg) { views(); if (arg && VORDER.indexOf(arg) > -1 && arg !== st.v) { st.v = arg; st.sel = null; st.test = null; } draw(); };
    if (location.hash.indexOf("#diagrams") === 0 && typeof route === "function") route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();