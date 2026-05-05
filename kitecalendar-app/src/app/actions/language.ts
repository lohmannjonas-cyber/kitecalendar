"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/i18n/server";
import { isLocale, type Locale } from "@/i18n/dictionaries";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
