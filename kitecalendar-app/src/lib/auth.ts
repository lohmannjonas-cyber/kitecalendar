import "server-only";

import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "kite_admin_session";
const encoder = new TextEncoder();

type AdminSession = {
  email: string;
  role: "admin";
};

function getSecret() {
  return encoder.encode(process.env.AUTH_SECRET ?? "development-only-kitecalendar-secret");
}

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.email !== "string") return undefined;
    return { email: payload.email, role: "admin" };
  } catch {
    return undefined;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  return session;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kitecalendar.com";
  if (email.toLowerCase() !== adminEmail.toLowerCase()) return false;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    return compare(password, hash);
  }

  const configuredPassword = process.env.ADMIN_PASSWORD ?? "change-this-before-production";
  return password === configuredPassword;
}
