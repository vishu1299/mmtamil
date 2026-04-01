/** Use on <Link> / <a> for /privacyinfo and /legal-terms (+ subpaths, hashes). */
export const POLICY_PAGE_NEW_TAB = {
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
};

export function isPolicyPageHref(href: string): boolean {
  return (
    href.startsWith("/privacyinfo") || href.startsWith("/legal-terms")
  );
}
