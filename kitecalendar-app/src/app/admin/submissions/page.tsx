import { AdminShell } from "@/components/admin-shell";
import { ReviewTable } from "@/components/review-table";
import { getI18n } from "@/i18n/server";
import { requireAdmin } from "@/lib/auth";
import { listReviewItems } from "@/lib/repository";

export const metadata = {
  title: "Admin Submissions",
};

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const { dictionary } = await getI18n();
  const submissions = await listReviewItems("user_submitted");

  return (
    <AdminShell dictionary={dictionary}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase text-sky-700">Kitecalendar.com</p>
        <h1 className="text-4xl font-black tracking-normal text-slate-950">{dictionary.admin.submissions}</h1>
      </div>
      <ReviewTable items={submissions} dictionary={dictionary} />
    </AdminShell>
  );
}
