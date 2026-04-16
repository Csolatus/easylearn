export function getRoleFromCookie(): string {
  if (typeof document === "undefined") return "student";
  try {
    const match = document.cookie.match(/auth_token=([^;]+)/);
    if (!match) return "student";
    const payload = JSON.parse(atob(match[1].split(".")[1]));
    return payload.role || "student";
  } catch {
    return "student";
  }
}
