/**
 * Country / region list for landing hero and search filter Country dropdown.
 * Values are stored in filter `from` and must match profile country fields where used.
 */
export const COUNTRY_OPTIONS = [
  "United Kingdom",
  "United States",
  "Canada",
  "France",
  "Germany",
  "Norway",
  "Switzerland",
  "New Zealand",
  "Malaysia",
  "Singapore",
  "India",
  "Italy",
  "Sweden",
  "Australia",
  "Dubai",
  "Qatar",
  "Saudi Arabia",
  "Oman",
  "Kuwait",
  "Sri Lanka",
] as const;

export type CountryOption = (typeof COUNTRY_OPTIONS)[number];

/** Matches landing hero; used when Country is Sri Lanka. */
export const SRILANKA = "Sri Lanka" as const;

export const SRILANKA_DISTRICTS = [
  "Jaffna",
  "Kilinochchi",
  "Vavuniya",
  "Mullaitivu",
  "Mannar",
  "Colombo",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Matale",
  "Matara",
  "Chilaw",
  "Puttalam",
  "Negombo",
  "Ratnapura",
  "Kandy",
  "Badulla",
  "Nuwara Eliya",
  "Gampaha",
  "Anuradhapura",
  "Kalutara",
  "Kegalle",
  "Polonnaruwa",
  "Galle",
  "Hambantota",
  "Other",
] as const;
