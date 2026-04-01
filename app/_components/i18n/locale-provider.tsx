"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { enMessages, taMessages } from "@/lib/i18n/load-messages";
import {
  APP_LOCALE_STORAGE,
  NEXT_LOCALE_COOKIE,
  type AppLocale,
  apiLanguageToLocale,
} from "@/lib/i18n/config";

const messages = { en: enMessages, ta: taMessages } as const;

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (next: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useAppLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useAppLocale must be used within LocaleProvider");
  }
  return ctx;
}

function readStoredLocale(): AppLocale | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(APP_LOCALE_STORAGE);
  if (v === "en" || v === "ta") return v;
  return null;
}

function persistLocaleClient(l: AppLocale) {
  localStorage.setItem(APP_LOCALE_STORAGE, l);
  document.cookie = `${NEXT_LOCALE_COOKIE}=${l}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const appTimeZone = "Asia/Colombo";

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    persistLocaleClient(next);
  }, []);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) {
      setLocaleState(stored);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { getuserByid } = await import(
          "@/app/(pages)/profile/api/api"
        );
        const res = await getuserByid();
        const appLang = (res?.data?.data?.profile?.appLanguage ??
          res?.data?.profile?.appLanguage) as string | undefined;
        const fromApi = apiLanguageToLocale(appLang);
        if (fromApi && !cancelled) {
          setLocaleState(fromApi);
          localStorage.setItem(APP_LOCALE_STORAGE, fromApi);
        }
      } catch {
        /* not logged in or network error */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ta" ? "ta" : "en";
  }, [locale]);

  const intlMessages = useMemo(() => messages[locale], [locale]);

  const ctxValue = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={ctxValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={intlMessages}
        timeZone={appTimeZone}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
