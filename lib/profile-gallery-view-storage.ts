/**
 * Persists successful gallery unlock (POST mmm/package/profile-view) per viewer + profile.
 * The Postman collection has no GET to check "already viewed"; this keeps UX correct after refresh.
 */
const PREFIX = "mm_profile_gallery_viewed";

export function profileGalleryViewStorageKey(
  viewerUserId: number,
  profileId: number
): string {
  return `${PREFIX}_${viewerUserId}_${profileId}`;
}

export function hasRecordedProfileGalleryView(
  viewerUserId: number,
  profileId: number
): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem(
        profileGalleryViewStorageKey(viewerUserId, profileId)
      ) === "1"
    );
  } catch {
    return false;
  }
}

export function recordProfileGalleryView(
  viewerUserId: number,
  profileId: number
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      profileGalleryViewStorageKey(viewerUserId, profileId),
      "1"
    );
  } catch {
    // ignore quota / private mode
  }
}
