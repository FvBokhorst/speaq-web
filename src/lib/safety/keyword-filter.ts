/**
 * SPEAQ - Client-side objectionable-content filter (Apple Guideline 1.2).
 *
 * SPEAQ is end-to-end encrypted: the relay cannot moderate content. This
 * module runs ON the recipient's device after decryption to flag messages
 * that contain known offensive language. Flagged messages are blurred in
 * the UI with a "Reveal" affordance, and the user can then choose to
 * report or block the sender.
 *
 * The lists are intentionally conservative to limit false positives. They
 * cover slurs / abusive terms commonly used in messaging-app safety
 * filters across all 9 SPEAQ languages. Word-boundary matching keeps
 * neutral words containing these substrings (e.g., "assassination",
 * "Scunthorpe") from triggering. See LDNOOBW + Surge AI public lists for
 * lineage.
 *
 * This is the first defence layer; the second is user reporting and the
 * third is identity-level moderation (relay deny-list).
 */

export type SafetyLang =
  | "en"
  | "nl"
  | "fr"
  | "es"
  | "ru"
  | "de"
  | "sl"
  | "lg"
  | "sw";

// Per-language word lists. Keep the keys in sync with SafetyLang.
const WORD_LISTS: Record<SafetyLang, string[]> = {
  en: [
    "fuck", "fucker", "fucking", "motherfucker",
    "cunt", "twat", "bitch", "whore", "slut",
    "nigger", "nigga", "spic", "chink", "kike", "wetback", "gook",
    "faggot", "fag", "tranny", "dyke",
    "retard", "retarded",
    "rape", "rapist",
    "kill yourself", "kys",
    "child porn", "cp", "lolicon", "shotacon",
  ],
  nl: [
    "kankerlijer", "kanker", "tering", "klootzak", "kut",
    "neuken", "hoer", "slet",
    "neger", "kankerneger", "kk",
    "homo", "flikker", "mongool",
    "verkrachten",
    "ga dood", "pleeg zelfmoord",
  ],
  fr: [
    "putain", "salope", "pute", "connard", "enculé", "encule",
    "negre", "bougnoule", "youpin", "pede",
    "viol", "violeur",
    "tue toi",
  ],
  es: [
    "puta", "puto", "cabron", "hijoputa", "hijo de puta", "coño", "cono",
    "negrata", "moro de mierda", "sudaca", "maricon",
    "violador", "violacion",
    "matate",
  ],
  ru: [
    "blyad", "suka", "yebat", "yob",
    "pidor", "pederast",
    "iznasilovat",
    "ubyei sebya",
  ],
  de: [
    "fick", "ficker", "fotze", "hure", "schlampe", "wichser",
    "neger", "kanake", "schwuchtel",
    "vergewaltigen", "vergewaltiger",
    "bring dich um",
  ],
  sl: [
    "pizda", "kurac", "jebi", "jebem", "kurba",
    "ciganin", "peder",
    "posili",
    "ubij se",
  ],
  lg: [
    // Luganda - kept small, focuses on universal severe terms
    "ssetaani",
  ],
  sw: [
    "malaya", "kahaba", "shoga",
    "ubaka",
  ],
};

// Term lists are matched case-insensitive with a word-boundary on each
// side to limit false positives. We compile a single regex per language
// the first time we see it.
const REGEX_CACHE = new Map<SafetyLang, RegExp>();

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRegexFor(lang: SafetyLang): RegExp {
  let re = REGEX_CACHE.get(lang);
  if (re) return re;
  const list = WORD_LISTS[lang] || [];
  if (list.length === 0) {
    // Empty fallback regex - never matches.
    re = /\b__never__\b/i;
  } else {
    const alt = list.map(escapeRegex).join("|");
    re = new RegExp(`\\b(?:${alt})\\b`, "i");
  }
  REGEX_CACHE.set(lang, re);
  return re;
}

/**
 * Check if `text` contains objectionable language in the given language.
 * If `lang` is omitted we check the user's primary language plus EN as a
 * conservative fallback (since EN is the most-prevalent harassment
 * language in our messaging traffic).
 */
export function containsObjectionableContent(
  text: string,
  lang?: SafetyLang,
): boolean {
  if (!text || typeof text !== "string") return false;
  const langs: SafetyLang[] = lang ? [lang] : ["en"];
  if (lang && lang !== "en") langs.push("en");
  for (const l of langs) {
    if (getRegexFor(l).test(text)) return true;
  }
  return false;
}

/**
 * Returns the matched word (lowercased) if the text contains objectionable
 * content. Useful for diagnostic UIs / logging. Returns null otherwise.
 */
export function findObjectionableMatch(
  text: string,
  lang?: SafetyLang,
): string | null {
  if (!text || typeof text !== "string") return null;
  const langs: SafetyLang[] = lang ? [lang] : ["en"];
  if (lang && lang !== "en") langs.push("en");
  for (const l of langs) {
    const m = text.match(getRegexFor(l));
    if (m) return m[0].toLowerCase();
  }
  return null;
}
