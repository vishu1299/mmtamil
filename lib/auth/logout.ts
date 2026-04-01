/**
 * Same behaviour as `app/_components/navbar/nav-menu.tsx` logout:
 * notify WebSocket, clear storage, go to login.
 */
export function performLogout(router: { push: (path: string) => void }): void {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("access-token");
  if (token) {
    try {
      const userData = JSON.parse(token) as { data?: { result?: { id?: number } } };
      const currentUserId = userData.data?.result?.id;

      window.dispatchEvent(new Event("user-logout"));

      if (
        currentUserId != null &&
        window.globalWs &&
        window.globalWs.readyState === WebSocket.OPEN
      ) {
        window.globalWs.send(
          JSON.stringify({
            type: "user_disconnected",
            userId: currentUserId,
          })
        );
      }
    } catch (e) {
      console.error("Logout pre-clear:", e);
    }
  }

  localStorage.clear();
  router.push("/login");
}
