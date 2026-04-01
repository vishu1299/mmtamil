/**
 * Public profile number: exactly 5 digits.
 * Odd last digit = female, even last digit = male (adjusts the last digit to match gender).
 */
export function formatDisplayProfileId(
  raw: string | number | undefined | null,
  gender: string | undefined
): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return "—";
  let n = parseInt(digits.slice(-12), 10);
  if (Number.isNaN(n)) return "—";
  n = n % 100000;
  const isFemale = gender?.toUpperCase() === "FEMALE";
  const last = n % 10;
  if (isFemale) {
    if (last % 2 === 0) n = n < 99999 ? n + 1 : n - 1;
  } else {
    if (last % 2 === 1) n = n < 99999 ? n + 1 : n - 1;
  }
  return String(n).padStart(5, "0");
}
