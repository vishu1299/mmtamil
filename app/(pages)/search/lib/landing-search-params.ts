import type { FilterProps } from "../api/api";

/** Landing hero age dropdown values → API age range */
const LANDING_AGE_TO_RANGE: Record<string, { ageFrom: number; ageTo: number }> = {
  "18 - 24": { ageFrom: 18, ageTo: 24 },
  "25 - 30": { ageFrom: 25, ageTo: 30 },
  "31 - 35": { ageFrom: 31, ageTo: 35 },
  "36 - 40": { ageFrom: 36, ageTo: 40 },
  "41 - 45": { ageFrom: 41, ageTo: 45 },
  "46+": { ageFrom: 46, ageTo: 80 },
};

/** Landing religion labels → search filter API values (see search-filter religionOptions) */
const RELIGION_LANDING_TO_API: Record<string, string> = {
  Hindu: "HINDU",
  "Roman Catholic (RC)": "ROMAN_CATHOLIC",
  "Non RC": "CHRISTIAN",
  "No Religion": "NO_RELIGION",
  Other: "OTHER",
};

/**
 * Map URL query params from the landing hero search into FilterProps.
 */
export function parseLandingSearchParams(
  searchParams: URLSearchParams
): Partial<FilterProps> {
  const out: Partial<FilterProps> = {};
  const ageFromParam = searchParams.get("ageFrom");
  const ageToParam = searchParams.get("ageTo");
  if (ageFromParam !== null && ageToParam !== null) {
    const af = parseInt(ageFromParam, 10);
    const at = parseInt(ageToParam, 10);
    if (!Number.isNaN(af) && !Number.isNaN(at)) {
      let lo = Math.max(18, Math.min(80, af));
      let hi = Math.max(18, Math.min(80, at));
      if (lo > hi) [lo, hi] = [hi, lo];
      out.ageFrom = lo;
      out.ageTo = hi;
    }
  } else {
    const age = searchParams.get("age");
    if (age && LANDING_AGE_TO_RANGE[age]) {
      Object.assign(out, LANDING_AGE_TO_RANGE[age]);
    }
  }
  const religion = searchParams.get("religion");
  if (religion && RELIGION_LANDING_TO_API[religion]) {
    out.religion = RELIGION_LANDING_TO_API[religion];
  }
  const location = searchParams.get("location");
  if (location?.trim()) {
    out.city = location.trim();
  }
  return out;
}

export function hasLandingSearchParams(searchParams: URLSearchParams): boolean {
  return Boolean(
    searchParams.get("age") ||
      searchParams.get("ageFrom") ||
      searchParams.get("ageTo") ||
      searchParams.get("religion") ||
      (searchParams.get("location")?.trim() ?? "")
  );
}
