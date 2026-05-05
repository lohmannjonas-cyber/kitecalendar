import { addDays } from "date-fns";
import type { CrawlSourceDefinition } from "@/lib/crawler/types";

function iso(days: number) {
  const date = addDays(new Date(), days);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}

export const tourismEventsCrawler: CrawlSourceDefinition = {
  id: "tourism-events-demo",
  name: "Tourism event calendar example",
  baseUrl: "https://kitecalendar.com/demo/tourism-events",
  kind: "tourism",
  robotsPolicy: "checked-allow",
  termsNote:
    "Demo source. Do not bypass logins, paywalls, captchas, rate limits, anti-bot systems, or blocked robots rules.",
  async crawl() {
    return [
      {
        title: "Lake Garda Foil Festival",
        description:
          "Candidate from a destination events page. Needs organizer confirmation and schedule validation.",
        startDate: iso(32),
        endDate: iso(34),
        country: "Italy",
        region: "Trentino",
        city: "Torbole",
        spotName: "Lake Garda",
        latitude: 45.8702,
        longitude: 10.8755,
        eventTypeSlug: "festival",
        organizerName: "Garda Outdoor Office",
        organizerWebsite: "https://kitecalendar.com/demo/lake-garda",
        brandNames: ["Flysurfer", "F-One", "Other"],
        sourceUrl: "https://kitecalendar.com/demo/tourism-events/lake-garda-foil",
      },
    ];
  },
};
