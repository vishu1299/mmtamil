/** Extract PayPal approval redirect URL from create-order response bodies. */
export function getPayPalApprovalUrl(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const root = payload as Record<string, unknown>;
  const data = (root.data ?? root) as Record<string, unknown>;

  const direct =
    data.approvalUrl ??
    data.approval_url ??
    data.approveUrl ??
    data.approve_url;
  if (typeof direct === "string" && direct.startsWith("http")) return direct;

  const links = data.links;
  if (Array.isArray(links)) {
    const approve = links.find(
      (l: { rel?: string; href?: string }) =>
        l?.rel === "approve" || l?.rel === "payer-action"
    );
    if (approve && typeof approve.href === "string") return approve.href;
  }

  return undefined;
}
