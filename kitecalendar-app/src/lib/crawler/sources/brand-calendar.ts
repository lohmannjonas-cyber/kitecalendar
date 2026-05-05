import { addDays } from "date-fns";
import type { CrawlSourceDefinition } from "@/lib/crawler/types";

function iso(days: number) {
  const date = addDays(new Date(), days);
  date.setHours(10, 0, 0, 0);
  return date.toISOString();
}

export const brandCalendarCrawler: CrawlSourceDefinition = {
  id: "brand-calendar-demo",
  name: "Brand demo calendar example",
  baseUrl: "https://kitecalendar.com/demo/brand-calendar",
  kind: "brand",
  robotsPolicy: "checked-allow",
  termsNote: "Demo source. Real crawlers must check robots.txt and public terms before fetching.",
  async crawl() {
    return [
      {
        title: "Scheveningen Brand Demo Weekend",
        description:
          "Candidate discovered from a public brand demo calendar. Admin should verify brands and registration URL.",
        startDate: iso(24),
        endDate: iso(25),
        country: "Netherlands",
        region: "South Holland",
        city: "The Hague",
        spotName: "Scheveningen",
        latitude: 52.1036,
        longitude: 4.2699,
        eventTypeSlug: "brand-activation",
        organizerName: "Demo Brand Team",
        organizerWebsite: "https://kitecalendar.com/demo/scheveningen-demo",
        brandNames: ["Duotone", "North"],
        sourceUrl: "https://kitecalendar.com/demo/brand-calendar/scheveningen-demo",
      },
    ];
  },
};
