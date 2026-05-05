import { cookies } from "next/headers";
import { getDictionary, isLocale, type Locale } from "@/i18n/dictionaries";

const COOKIE_NAME = "kite_locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return isLocale(value) ? value : "en";
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, dictionary: getDictionary(locale) };
}

export { COOKIE_NAME };
