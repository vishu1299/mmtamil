import enCore from "@/messages/en.json";
import taCore from "@/messages/ta.json";
import enApp from "@/messages/en.app.json";
import taApp from "@/messages/ta.app.json";
import legalTermsStaticEn from "@/messages/legal-terms-static-en.json";
import legalTermsStaticTa from "@/messages/legal-terms-static-ta.json";
import privacyInfoStaticEn from "@/messages/privacy-info-static-en.json";
import privacyInfoStaticTa from "@/messages/privacy-info-static-ta.json";

type Msg = Record<string, unknown>;

function deepMerge<T extends Msg>(base: T, ext: Msg): T {
  const out = { ...base } as Msg;
  for (const key of Object.keys(ext)) {
    const b = base[key];
    const e = ext[key];
    if (
      b &&
      e &&
      typeof b === "object" &&
      typeof e === "object" &&
      !Array.isArray(b) &&
      !Array.isArray(e)
    ) {
      out[key] = deepMerge(b as Msg, e as Msg);
    } else if (e !== undefined) {
      out[key] = e;
    }
  }
  return out as T;
}

/** Flat merge for `legalTerms` so static EN/TA JSON always wins predictably over core strings. */
function mergeLegalTermsFromStatic<T extends Msg>(
  base: T,
  staticBlock: { legalTerms: Msg }
): T {
  const prev = (base.legalTerms as Msg) ?? {};
  const next = (staticBlock.legalTerms as Msg) ?? {};
  return {
    ...base,
    legalTerms: { ...prev, ...next },
  } as T;
}

const enAfterApp = deepMerge(enCore as Msg, enApp as Msg) as Msg;
const taAfterApp = deepMerge(taCore as Msg, taApp as Msg) as Msg;

export const enMessages = deepMerge(
  mergeLegalTermsFromStatic(enAfterApp, legalTermsStaticEn as { legalTerms: Msg }),
  privacyInfoStaticEn as Msg
) as typeof enCore & typeof enApp;
export const taMessages = deepMerge(
  mergeLegalTermsFromStatic(taAfterApp, legalTermsStaticTa as { legalTerms: Msg }),
  privacyInfoStaticTa as Msg
) as typeof taCore & typeof taApp;
