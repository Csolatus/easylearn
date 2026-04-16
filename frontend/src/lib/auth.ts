export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  exp?: number;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}
