import type { User } from "../type/type";

/**
 * Match gender for browse/carousel: opposite of the logged-in user.
 * Uses profile.gender / user.gender, or profile.iAm (GROOM / BRIDE) when gender is missing.
 */
export type ViewerGender = "MALE" | "FEMALE";

export function resolveViewerGender(user: unknown): ViewerGender | null {
  const u = user as Record<string, unknown> | null | undefined;
  if (!u) return null;
  const profile = u.profile as Record<string, unknown> | undefined;
  const g = String(profile?.gender ?? u.gender ?? "")
    .trim()
    .toUpperCase();
  if (g === "MALE" || g === "M") return "MALE";
  if (g === "FEMALE" || g === "F") return "FEMALE";
  const iAm = String(profile?.iAm ?? "")
    .trim()
    .toUpperCase();
  if (iAm === "GROOM") return "MALE";
  if (iAm === "BRIDE") return "FEMALE";
  return null;
}

/** Value for FilterProps.lookingFor on getAll / admin filter (uppercase). */
export function oppositeLookingForFilter(vg: ViewerGender): string {
  return vg === "MALE" ? "FEMALE" : "MALE";
}

/** When admin/getAll returns mixed genders, keep only the intended match gender. */
export function filterUsersByMatchGender(
  users: User[],
  wantGender: string | null | undefined
): User[] {
  if (!wantGender || !users?.length) return users;
  const w = wantGender.trim().toUpperCase();
  return users.filter(
    (u) => (u.profile?.gender ?? "").toUpperCase() === w
  );
}
