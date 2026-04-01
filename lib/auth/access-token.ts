/**
 * Client-side check for MM Tamil login (matches utils/axios-interceptor token shape).
 */
export function hasAccessToken(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("access-token");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      token?: { access?: { token?: string } };
    };
    const t = parsed?.token?.access?.token;
    return typeof t === "string" && t.length > 0;
  } catch {
    return false;
  }
}

/** Display name from login payload (`data.result`), same shape as navbar / chat. */
export function getSessionUserDisplayName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("access-token");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      data?: { result?: { userName?: string; email?: string } };
    };
    const result = parsed?.data?.result;
    const name = result?.userName?.trim();
    if (name) return name;
    const email = result?.email?.trim();
    if (email) return email.split("@")[0] ?? email;
    return null;
  } catch {
    return null;
  }
}
