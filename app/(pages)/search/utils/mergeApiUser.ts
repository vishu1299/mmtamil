import type { Profile, User } from "../type/type";

function str(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

function arr(v: unknown): any[] {
  return Array.isArray(v) ? v : [];
}

function normalizeProfile(
  p: Record<string, unknown> | null | undefined,
  fallback: Profile
): Profile {
  if (!p || typeof p !== "object") return { ...fallback };

  const pr = p as Record<string, unknown>;
  const id = typeof pr.id === "number" ? pr.id : fallback.id;
  const userId =
    typeof pr.userId === "number"
      ? pr.userId
      : typeof pr.userId === "string"
        ? Number(pr.userId) || fallback.userId
        : fallback.userId;

  return {
    ...fallback,
    ...p,
    id,
    userId,
    gender: str(pr.gender) || fallback.gender,
    dateOfBirth: str(pr.dateOfBirth) || fallback.dateOfBirth,
    profilePicture:
      pr.profilePicture === null || pr.profilePicture === undefined
        ? ""
        : str(pr.profilePicture),
    bio: str(pr.bio),
    interests: arr(pr.interests),
    languagesSpoken: arr(pr.languagesSpoken),
    traits: arr(pr.traits),
    movies: arr(pr.movies),
    music: arr(pr.music),
    personality: pr.personality == null ? null : str(pr.personality),
    country: pr.country == null ? null : str(pr.country),
    city: pr.city == null ? null : str(pr.city),
    field_of_work: pr.field_of_work == null ? null : str(pr.field_of_work),
    understand_english: str(pr.understand_english) || fallback.understand_english,
    credits: typeof pr.credits === "number" ? pr.credits : fallback.credits,
    religion: str(pr.religion) || fallback.religion,
    martialStatus:
      str(pr.martialStatus ?? pr.maritalStatus) || fallback.martialStatus,
    children: str(pr.children ?? pr.childrenStatus) || fallback.children,
    isAggredTandC: Boolean(pr.isAggredTandC),
    registrationId: str(pr.registrationId) || fallback.registrationId,
    createdAt: str(pr.createdAt) || fallback.createdAt,
    updatedAt: str(pr.updatedAt) || fallback.updatedAt,
    height: pr.height == null ? null : str(pr.height),
    caste: pr.caste == null ? null : str(pr.caste),
    subCaste: pr.subCaste == null ? null : str(pr.subCaste),
    motherTongue: pr.motherTongue == null ? null : str(pr.motherTongue),
    education: pr.education == null ? null : str(pr.education),
    profession: pr.profession == null ? null : str(pr.profession),
    company: pr.company == null ? null : str(pr.company),
    state: pr.state == null ? null : str(pr.state),
    birthTime: pr.birthTime == null ? null : str(pr.birthTime),
    zodiac: pr.zodiac == null ? null : str(pr.zodiac),
    star: pr.star == null ? null : str(pr.star),
    firstName: pr.firstName == null ? null : str(pr.firstName),
    lastName: pr.lastName == null ? null : str(pr.lastName),
    fatherDetails: pr.fatherDetails == null ? null : str(pr.fatherDetails),
    motherDetails: pr.motherDetails == null ? null : str(pr.motherDetails),
    siblingsDetails:
      pr.siblingsDetails == null ? null : str(pr.siblingsDetails),
    familyDetails:
      pr.familyDetails == null ? null : str(pr.familyDetails),
    hobbies: arr(pr.hobbies),
  };
}

/** Unwraps getById-style payloads and maps API field names onto our User/Profile shape. */
export function mergeApiUserResponse(raw: unknown, defaults: User): User {
  if (!raw || typeof raw !== "object") return defaults;

  const u = raw as Record<string, unknown>;
  const profileNorm = normalizeProfile(
    u.profile as Record<string, unknown>,
    defaults.profile
  );

  const nameFromProfile = [profileNorm.firstName, profileNorm.lastName]
    .filter((s) => s && String(s).trim())
    .join(" ")
    .trim();

  const userNameRaw = u.userName;
  const displayName =
    typeof userNameRaw === "string" && userNameRaw.trim()
      ? userNameRaw.trim()
      : nameFromProfile ||
        (profileNorm.registrationId
          ? `Member ${profileNorm.registrationId}`
          : "") ||
        (typeof u.id === "number" ? `Member #${u.id}` : "") ||
        defaults.userName;

  const id = typeof u.id === "number" ? u.id : defaults.id;

  return {
    ...defaults,
    ...u,
    id,
    userName: displayName,
    email: typeof u.email === "string" ? u.email : defaults.email,
    profileId: str(u.profileId) || str(profileNorm.registrationId) || defaults.profileId,
    registrationId:
      str(u.registrationId) ||
      profileNorm.registrationId ||
      defaults.registrationId,
    profile: profileNorm,
    posts: Array.isArray(u.posts) ? (u.posts as User["posts"]) : defaults.posts,
    verification:
      (u.verification as User["verification"]) ?? defaults.verification,
    preferences:
      (u.preferences as User["preferences"]) ?? defaults.preferences,
    interestReceived: Array.isArray(u.interestReceived)
      ? (u.interestReceived as User["interestReceived"])
      : defaults.interestReceived,
    followers: Array.isArray(u.followers)
      ? (u.followers as User["followers"])
      : defaults.followers,
    following: Array.isArray(u.following)
      ? (u.following as User["following"])
      : defaults.following,
  };
}

/** Pass the full axios response from getUserById. */
export function extractUserPayload(axiosResponse: unknown): unknown {
  if (!axiosResponse || typeof axiosResponse !== "object") return null;
  const res = axiosResponse as Record<string, unknown>;
  const body = res.data;
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.data != null) return b.data;
  return body;
}
