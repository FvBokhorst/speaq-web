/**
 * Privacy-preserving timezone-to-country mapping.
 *
 * Uses Intl.DateTimeFormat().resolvedOptions().timeZone (IANA tz string)
 * to derive a probable ISO 3166-1 alpha-2 country code.
 *
 * Rules:
 * - NO IP address is ever read or sent.
 * - NO GPS / geolocation API is used.
 * - The mapping is coarse by design (timezone ≠ exact country).
 * - Only the two-letter country code is transmitted, never the raw timezone.
 * - The server stores ONLY aggregate counters: { country_code, user_count }.
 */

const TZ_TO_COUNTRY: Record<string, string> = {
  // --- Europe ---
  "Europe/Amsterdam": "NL",
  "Europe/Berlin": "DE",
  "Europe/Brussels": "BE",
  "Europe/Bucharest": "RO",
  "Europe/Budapest": "HU",
  "Europe/Copenhagen": "DK",
  "Europe/Dublin": "IE",
  "Europe/Helsinki": "FI",
  "Europe/Istanbul": "TR",
  "Europe/Kyiv": "UA",
  "Europe/Lisbon": "PT",
  "Europe/Ljubljana": "SI",
  "Europe/London": "GB",
  "Europe/Luxembourg": "LU",
  "Europe/Madrid": "ES",
  "Europe/Malta": "MT",
  "Europe/Minsk": "BY",
  "Europe/Monaco": "MC",
  "Europe/Moscow": "RU",
  "Europe/Oslo": "NO",
  "Europe/Paris": "FR",
  "Europe/Prague": "CZ",
  "Europe/Riga": "LV",
  "Europe/Rome": "IT",
  "Europe/Sofia": "BG",
  "Europe/Stockholm": "SE",
  "Europe/Tallinn": "EE",
  "Europe/Tirane": "AL",
  "Europe/Vienna": "AT",
  "Europe/Vilnius": "LT",
  "Europe/Warsaw": "PL",
  "Europe/Zagreb": "HR",
  "Europe/Zurich": "CH",
  "Europe/Athens": "GR",
  "Europe/Belgrade": "RS",
  "Europe/Bratislava": "SK",
  "Europe/Chisinau": "MD",
  "Europe/Sarajevo": "BA",
  "Europe/Skopje": "MK",
  "Europe/Podgorica": "ME",

  // --- Americas ---
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "America/St_Johns": "CA",
  "America/Mexico_City": "MX",
  "America/Cancun": "MX",
  "America/Tijuana": "MX",
  "America/Sao_Paulo": "BR",
  "America/Manaus": "BR",
  "America/Fortaleza": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Bogota": "CO",
  "America/Lima": "PE",
  "America/Caracas": "VE",
  "America/Montevideo": "UY",
  "America/Asuncion": "PY",
  "America/La_Paz": "BO",
  "America/Guayaquil": "EC",
  "America/Panama": "PA",
  "America/Costa_Rica": "CR",
  "America/Guatemala": "GT",
  "America/Havana": "CU",
  "America/Jamaica": "JM",
  "America/Port-au-Prince": "HT",
  "America/Santo_Domingo": "DO",
  "America/Tegucigalpa": "HN",
  "America/Managua": "NI",
  "America/El_Salvador": "SV",

  // --- Asia ---
  "Asia/Tokyo": "JP",
  "Asia/Shanghai": "CN",
  "Asia/Chongqing": "CN",
  "Asia/Hong_Kong": "HK",
  "Asia/Seoul": "KR",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Singapore": "SG",
  "Asia/Bangkok": "TH",
  "Asia/Jakarta": "ID",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Manila": "PH",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Taipei": "TW",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Karachi": "PK",
  "Asia/Dhaka": "BD",
  "Asia/Colombo": "LK",
  "Asia/Kathmandu": "NP",
  "Asia/Yangon": "MM",
  "Asia/Phnom_Penh": "KH",
  "Asia/Tehran": "IR",
  "Asia/Baghdad": "IQ",
  "Asia/Beirut": "LB",
  "Asia/Jerusalem": "IL",
  "Asia/Amman": "JO",
  "Asia/Kuwait": "KW",
  "Asia/Muscat": "OM",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Baku": "AZ",
  "Asia/Tbilisi": "GE",
  "Asia/Yerevan": "AM",
  "Asia/Almaty": "KZ",
  "Asia/Tashkent": "UZ",
  "Asia/Kabul": "AF",
  "Asia/Ulaanbaatar": "MN",

  // --- Africa ---
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "Africa/Johannesburg": "ZA",
  "Africa/Casablanca": "MA",
  "Africa/Accra": "GH",
  "Africa/Addis_Ababa": "ET",
  "Africa/Dar_es_Salaam": "TZ",
  "Africa/Kampala": "UG",
  "Africa/Kigali": "RW",
  "Africa/Kinshasa": "CD",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Africa/Tripoli": "LY",
  "Africa/Maputo": "MZ",
  "Africa/Lusaka": "ZM",
  "Africa/Harare": "ZW",
  "Africa/Douala": "CM",
  "Africa/Dakar": "SN",
  "Africa/Abidjan": "CI",

  // --- Oceania ---
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Australia/Adelaide": "AU",
  "Australia/Darwin": "AU",
  "Australia/Hobart": "AU",
  "Pacific/Auckland": "NZ",
  "Pacific/Fiji": "FJ",
  "Pacific/Guam": "GU",
  "Pacific/Port_Moresby": "PG",
};

/** Human-readable country names for display */
export const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AR: "Argentina",
  AM: "Armenia", AU: "Australia", AT: "Austria", AZ: "Azerbaijan",
  BH: "Bahrain", BD: "Bangladesh", BY: "Belarus", BE: "Belgium",
  BO: "Bolivia", BA: "Bosnia & Herzegovina", BR: "Brazil", BG: "Bulgaria",
  KH: "Cambodia", CM: "Cameroon", CA: "Canada", CL: "Chile",
  CN: "China", CO: "Colombia", CD: "DR Congo", CR: "Costa Rica",
  CI: "Côte d'Ivoire", HR: "Croatia", CU: "Cuba", CZ: "Czechia",
  DK: "Denmark", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt",
  SV: "El Salvador", EE: "Estonia", ET: "Ethiopia", FJ: "Fiji",
  FI: "Finland", FR: "France", GE: "Georgia", DE: "Germany",
  GH: "Ghana", GR: "Greece", GT: "Guatemala", GU: "Guam",
  HT: "Haiti", HN: "Honduras", HK: "Hong Kong", HU: "Hungary",
  IN: "India", ID: "Indonesia", IR: "Iran", IQ: "Iraq",
  IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica",
  JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya",
  KR: "South Korea", KW: "Kuwait", LV: "Latvia", LB: "Lebanon",
  LT: "Lithuania", LU: "Luxembourg", LY: "Libya", MY: "Malaysia",
  MT: "Malta", MX: "Mexico", MD: "Moldova", MC: "Monaco",
  MN: "Mongolia", ME: "Montenegro", MA: "Morocco", MZ: "Mozambique",
  MM: "Myanmar", NP: "Nepal", NL: "Netherlands", NZ: "New Zealand",
  NI: "Nicaragua", NG: "Nigeria", MK: "North Macedonia", NO: "Norway",
  OM: "Oman", PK: "Pakistan", PA: "Panama", PG: "Papua New Guinea",
  PY: "Paraguay", PE: "Peru", PH: "Philippines", PL: "Poland",
  PT: "Portugal", QA: "Qatar", RO: "Romania", RU: "Russia",
  RW: "Rwanda", SA: "Saudi Arabia", SN: "Senegal", RS: "Serbia",
  SG: "Singapore", SK: "Slovakia", SI: "Slovenia", ZA: "South Africa",
  ES: "Spain", LK: "Sri Lanka", SE: "Sweden", CH: "Switzerland",
  TW: "Taiwan", TZ: "Tanzania", TH: "Thailand", TN: "Tunisia",
  TR: "Turkey", UA: "Ukraine", AE: "UAE", GB: "United Kingdom",
  US: "United States", UY: "Uruguay", UZ: "Uzbekistan", VE: "Venezuela",
  VN: "Vietnam", ZM: "Zambia", ZW: "Zimbabwe", UG: "Uganda",
};

/**
 * Detect the user's probable country code from their browser timezone.
 * Returns a two-letter ISO country code, or "XX" if unknown.
 */
export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return "XX";

    // Direct lookup
    if (TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];

    // Fallback: extract region from timezone string (e.g. "Europe/Berlin" → try continent match)
    // Some systems return legacy or unusual timezone names
    const parts = tz.split("/");
    if (parts.length >= 2) {
      // Try matching the city part against known entries
      for (const [key, code] of Object.entries(TZ_TO_COUNTRY)) {
        if (key.endsWith(`/${parts[parts.length - 1]}`)) return code;
      }
    }

    return "XX";
  } catch {
    return "XX";
  }
}

/**
 * Get the human-readable name for a country code.
 */
export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}
