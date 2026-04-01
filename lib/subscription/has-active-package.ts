import { getuserByid } from "@/app/(pages)/profile/api/api";

/** Mirrors /premium: active package means profile or contact view quota from latest payment. */
export interface UserPaymentItem {
  profileShowLimit?: number;
  contactViewLimit?: number;
  createdAt?: string;
  package?: {
    profileShowLimit?: number;
    contactViewLimit?: number;
  };
}

/** Unwrap getuserByid() / API shape: user may be at `data` or `data.data`. */
export function normalizeUserFromGetByIdResponse(res: {
  data?: unknown;
} | null): unknown {
  const raw = res?.data;
  if (raw == null) return undefined;
  if (typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if ("UserPayment" in o || "userPayment" in o || "profile" in o) return o;
  const inner = o.data;
  if (inner && typeof inner === "object") {
    const inObj = inner as Record<string, unknown>;
    if (
      "UserPayment" in inObj ||
      "userPayment" in inObj ||
      "profile" in inObj
    ) {
      return inner;
    }
  }
  return o;
}

function toNum(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function hasActivePackageFromUserData(user: unknown): boolean {
  if (!user || typeof user !== "object") return false;
  const u = user as Record<string, unknown>;
  const raw = u.UserPayment ?? u.userPayment;
  const payments = Array.isArray(raw) ? (raw as UserPaymentItem[]) : [];
  if (payments.length === 0) return false;
  const latest = [...payments].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  )[0];
  const pkg = latest?.package;
  const profileShow = toNum(
    latest?.profileShowLimit ?? pkg?.profileShowLimit ?? 0
  );
  const contactView = toNum(
    latest?.contactViewLimit ?? pkg?.contactViewLimit ?? 0
  );
  return profileShow > 0 || contactView > 0;
}

export async function fetchHasActivePackage(): Promise<boolean> {
  try {
    const res = await getuserByid();
    const userData = normalizeUserFromGetByIdResponse(res ?? null);
    return hasActivePackageFromUserData(userData);
  } catch {
    return false;
  }
}
