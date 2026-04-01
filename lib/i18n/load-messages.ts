import enCore from "@/messages/en.json";
import taCore from "@/messages/ta.json";
import enApp from "@/messages/en.app.json";
import taApp from "@/messages/ta.app.json";

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

export const enMessages = deepMerge(
  enCore as Msg,
  enApp as Msg
) as typeof enCore & typeof enApp;
export const taMessages = deepMerge(
  taCore as Msg,
  taApp as Msg
) as typeof taCore & typeof taApp;
