import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "admin_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24h

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: AdminSession
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());

    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: String(payload.role),
      isActive: Boolean(payload.isActive),
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: AdminSession): Promise<void> {
  const token = await createSessionToken(session);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}