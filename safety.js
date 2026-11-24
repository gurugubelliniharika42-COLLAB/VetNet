/* VetNet kindness filter: blocks rude words in names, feedback and comments. Add or remove words inside the WORDS list. */
(function () {
  "use strict";
  function vnBad(text) {
    /* Words that are not allowed. Add your own inside the quotes, in lowercase. */
    var WORDS = ("fuck fucks fucked fucker fuckers fucking fck fuk fukin fuking shit shits shitty sht bullshit bitches bastard bastards asshole assholes dickhead cunt cunts slut sluts whore whores " +
      "idiot idiots moron morons stupid dumbass jackass retard retarded loser losers scum wtf stfu gtfo kys nigger niggers nigga faggot fag " +
      "madarchod behenchod bhenchod bhosdike bhosdi bhosda bhosdika bkl bsdk chutiya chutiye chutia chut gandu gaandu gand gaand harami haramkhor haramzada haramzade randi raand kamina kamine kamini bakchod lodu lauda lund lavde lawde loda " +
      "lanja lanjakoduku lanjakodaka lanjakodukulu lanjalu erripuku erripooku erripuka pooku dengu dengey dengutha dengesa dengina denga modda thevudiya tevudiya thevidiya nakodka nakodaka").split(" ");
    /* If one of these appears inside a word, it is blocked too (catches "fuckyou", "motherfucker") */
    var ROOTS = ["fuck", "bitch", "asshole", "madarchod", "behenchod", "bhenchod", "chutiya", "bhosd", "lanjakod", "erripu", "nigger", "faggot", "whore"];
    var PHRASES = [/kill\s*yourself/, /go\s+die\b/, /\bmother\s*fuck/, /\bson of a (bitch|whore)/, /\bnee\s+amma/, /\byour\s+mother\b.*\b(fuck|bitch)/];
    var LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "+": "t" };
    var VET = /\b(dog|dogs|canine|canines|pyometra|whelp\w*|estrus|oestrus|heat|breeding|pup|pups|puppy|puppies|female|spay\w*|uterus|bred|litter|vet|veterinary)\b/;
    function collapse(w) { return w.replace(/(.)\1+/g, "$1"); }
    var SET = {}, SETC = {}, i;
    for (i = 0; i < WORDS.length; i++) { SET[WORDS[i]] = 1; if (WORDS[i].length >= 4) SETC[collapse(WORDS[i])] = 1; }
    var raw = String(text == null ? "" : text).toLowerCase();
    if (!raw.trim()) return false;
    var vetCtx = VET.test(raw);
    for (i = 0; i < PHRASES.length; i++) if (PHRASES[i].test(raw)) return true;
    function hit(tok) {
      if (!tok) return false;
      var c = collapse(tok), variants = [tok, c];
      for (var v = 0; v < variants.length; v++) {
        var t = variants[v];
        if (t === "bitch" || t === "bitches") { if (!vetCtx) return true; continue; }
        if (SET[t] || (t.length >= 4 && SETC[t])) return true;
        for (var r = 0; r < ROOTS.length; r++) if (t.indexOf(ROOTS[r]) > -1) { if (ROOTS[r] === "bitch" && vetCtx) continue; return true; }
      }
      return false;
    }
    function norm(tok) {
      tok = tok.replace(/^[^a-z0-9@$]+|[^a-z0-9@$!+]+$/g, "").replace(/[.\-_*'"`~]+/g, "");
      return tok.replace(/[0-9@$!+]/g, function (ch) { return LEET[ch] || ch; });
    }
    var toks = raw.split(/\s+/);
    for (i = 0; i < toks.length; i++) if (hit(norm(toks[i]))) return true;
    /* spaced-out letters like "f u c k" or "f.u.c.k" */
    var m, re = /(?:^|\s)((?:[a-z0-9@$][\s.\-_*]+){2,}[a-z0-9@$])(?=$|\s)/g;
    while ((m = re.exec(raw))) if (hit(norm(m[1].replace(/[\s.\-_*]+/g, "")))) return true;
    return false;
  }
  window.VETNET_SAFE = { bad: vnBad };
})();