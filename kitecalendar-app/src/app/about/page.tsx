import { CheckCircle2, CloudSun, DatabaseZap, ShieldCheck } from "lucide-react";
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
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">{dictionary.about.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{dictionary.about.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-md border border-sky-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black text-slate-950">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
