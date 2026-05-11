import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getI18n } from "@/i18n/server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Kitecalendar.com",
    template: "%s | Kitecalendar.com",
  },
  description: "The premium global calendar for kitesurfing events, brand demos, competitions, and windy weekends.",
  openGraph: {
    title: "Kitecalendar.com",
    description: "Find the best upcoming kitesurfing events worldwide.",
    siteName: "Kitecalendar.com",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dictionary } = await getI18n();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#f6faff] pb-16 text-[#171c20]">
        <SiteHeader locale={locale} dictionary={dictionary} />
        <main className="flex-1">{children}</main>
        <SiteFooter dictionary={dictionary} />
        <BottomNav dictionary={dictionary} />
      </body>
    </html>
  );
}
