import { AdminLogin } from "@/components/admin-login";
import { AdminShell } from "@/components/admin-shell";
import { AnalyticsPanel } from "@/components/analytics-panel";
import { ReviewTable } from "@/components/review-table";
import { getI18n } from "@/i18n/server";
import { getAdminSession } from "@/lib/auth";
import { getAnalytics, listReviewItems } from "@/lib/repository";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { dictionary } = await getI18n();
  const session = await getAdminSession();

  if (!session) {
    return <AdminLogin dictionary={dictionary} error={typeof params.error === "string" ? params.error : undefined} />;
  }

  const [analytics, reviewItems] = await Promise.all([getAnalytics(), listReviewItems()]);

  return (
    <AdminShell dictionary={dictionary}>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
          <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.admin.dashboard}</h1>
        </div>
        <AnalyticsPanel analytics={analytics} dictionary={dictionary} />
        <div>
          <h2 className="mb-3 text-2xl font-black text-slate-950">{dictionary.admin.reviewQueue}</h2>
          <ReviewTable items={reviewItems.slice(0, 5)} dictionary={dictionary} />
        </div>
      </div>
    </AdminShell>
  );
}
