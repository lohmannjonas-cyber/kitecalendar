import { redirect } from "next/navigation";
import { parseStringArray } from "@/lib/utils";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    for (const stringValue of parseStringArray(value)) {
      nextParams.append(key, stringValue);
    }
  }

  const query = nextParams.toString();
  redirect(query ? `/?${query}#events` : "/#events");
}
