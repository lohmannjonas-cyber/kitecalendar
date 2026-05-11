import { CheckCircle2, CloudSun, DatabaseZap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getI18n } from "@/i18n/server";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const { dictionary } = await getI18n();

  const pillars = [
    { icon: DatabaseZap, title: dictionary.about.discoveryTitle, body: dictionary.about.discoveryBody },
    { icon: ShieldCheck, title: dictionary.about.reviewTitle, body: dictionary.about.reviewBody },
    { icon: CloudSun, title: dictionary.about.windTitle, body: dictionary.about.windBody },
    { icon: CheckCircle2, title: dictionary.about.trustTitle, body: dictionary.about.trustBody },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <p className="text-sm font-black uppercase text-[#00658e]">Kitecalendar.com</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-[#032d60] sm:text-5xl">{dictionary.about.title}</h1>
        <p className="mt-4 text-2xl font-black leading-8 text-[#171c20]">{dictionary.about.tagline}</p>
        <p className="mt-5 text-lg leading-8 text-[#3e4850]">{dictionary.about.body}</p>
      </div>

      <section className="mt-10 rounded-xl border border-[#d8dde6] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-[#032d60]">{dictionary.about.whyTitle}</h2>
        <p className="mt-3 text-base leading-7 text-[#3e4850]">{dictionary.about.whyBody}</p>
      </section>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-black text-[#032d60]">{dictionary.about.howTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-xl border border-[#d8dde6] bg-white p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-[#c7e7ff] text-[#00658e]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black text-slate-950">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.body}</p>
            </div>
          );
        })}
        </div>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#d8dde6] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#032d60]">{dictionary.about.whoTitle}</h2>
          <p className="mt-3 text-base leading-7 text-[#3e4850]">{dictionary.about.whoBody}</p>
        </div>
        <div className="rounded-xl border border-[#84cfff] bg-[#c7e7ff] p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#00334a]">{dictionary.about.addTitle}</h2>
          <p className="mt-3 text-base leading-7 text-[#00334a]">{dictionary.about.addBody}</p>
          <Link
            href="/submit-event"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#00658e] px-5 text-sm font-black text-white transition hover:bg-[#0088c7]"
          >
            {dictionary.nav.submit}
          </Link>
        </div>
      </section>

      <p className="mt-10 text-center text-lg font-black text-[#032d60]">{dictionary.about.closing}</p>
    </div>
  );
}
