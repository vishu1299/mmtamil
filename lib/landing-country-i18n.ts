import {
  COUNTRY_OPTIONS,
  SRILANKA_DISTRICTS,
  type CountryOption,
} from "@/lib/landing-country-options";

/** `landing.*` message keys (en.app / ta.app + core) — stored filter values stay English. */
export const countryMessageKey: Record<CountryOption, string> = {
  "United Kingdom": "countryUnitedKingdom",
  "United States": "countryUnitedStates",
  Canada: "countryCanada",
  France: "countryFrance",
  Germany: "countryGermany",
  Norway: "countryNorway",
  Switzerland: "countrySwitzerland",
  "New Zealand": "countryNewZealand",
  Malaysia: "countryMalaysia",
  Singapore: "countrySingapore",
  India: "countryIndia",
  Italy: "countryItaly",
  Sweden: "countrySweden",
  Australia: "countryAustralia",
  Dubai: "countryDubai",
  Qatar: "countryQatar",
  "Saudi Arabia": "countrySaudiArabia",
  Oman: "countryOman",
  Kuwait: "countryKuwait",
  "Sri Lanka": "countrySriLanka",
};

export const districtMessageKey: Record<
  (typeof SRILANKA_DISTRICTS)[number],
  string
> = {
  Jaffna: "districtJaffna",
  Kilinochchi: "districtKilinochchi",
  Vavuniya: "districtVavuniya",
  Mullaitivu: "districtMullaitivu",
  Mannar: "districtMannar",
  Colombo: "districtColombo",
  Trincomalee: "districtTrincomalee",
  Batticaloa: "districtBatticaloa",
  Ampara: "districtAmpara",
  Matale: "districtMatale",
  Matara: "districtMatara",
  Chilaw: "districtChilaw",
  Puttalam: "districtPuttalam",
  Negombo: "districtNegombo",
  Ratnapura: "districtRatnapura",
  Kandy: "districtKandy",
  Badulla: "districtBadulla",
  "Nuwara Eliya": "districtNuwaraEliya",
  Gampaha: "districtGampaha",
  Anuradhapura: "districtAnuradhapura",
  Kalutara: "districtKalutara",
  Kegalle: "districtKegalle",
  Polonnaruwa: "districtPolonnaruwa",
  Galle: "districtGalle",
  Hambantota: "districtHambantota",
  Other: "districtOther",
};

const countrySet = new Set<string>(COUNTRY_OPTIONS as unknown as string[]);

export function isCountryOption(value: string): value is CountryOption {
  return countrySet.has(value);
}
