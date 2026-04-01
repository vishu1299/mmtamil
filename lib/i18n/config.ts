/** Client locale codes used in the app and localStorage */
export type AppLocale = "en" | "ta";

export const APP_LOCALE_STORAGE = "preferred-language";

/** Optional cookie for middleware / future SSR */
export const NEXT_LOCALE_COOKIE = "NEXT_LOCALE";

/** Map API profile.appLanguage (ENGLISH / TAMIL) to UI locale */
export function apiLanguageToLocale(api?: string | null): AppLocale | null {
  if (!api) return null;
  const u = String(api).toUpperCase();
  if (u === "TAMIL" || u === "TA") return "ta";
  if (u === "ENGLISH" || u === "EN") return "en";
  return null;
}

export function localeToApiLanguage(locale: AppLocale): "ENGLISH" | "TAMIL" {
  return locale === "ta" ? "TAMIL" : "ENGLISH";
}
