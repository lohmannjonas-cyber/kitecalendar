import { addDays, subDays } from "date-fns";
import { BRANDS, EVENT_TYPES } from "@/lib/constants";
import type { EventSubmission, KiteEvent } from "@/lib/types";
import { slugify } from "@/lib/utils";

function isoFromNow(days: number, hour = 10) {
  const date = addDays(new Date(), days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function isoAgo(days: number) {
  const date = subDays(new Date(), days);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}

function eventType(slug: string) {
  const type = EVENT_TYPES.find((item) => item.slug === slug);
  if (!type) throw new Error(`Missing event type ${slug}`);
  return type;
}

function brands(names: string[]) {
  return names.map((name) => {
    const brand = BRANDS.find((item) => item.name === name || item.id === slugify(name));
    return brand ?? BRANDS.find((item) => item.id === "other")!;
  });
}

export const sampleEvents: KiteEvent[] = [
  {
    id: "evt-tarifa-wind-week",
    title: "Tarifa Wind Week",
    slug: "tarifa-wind-week",
    description:
      "A week of big-air clinics, demo gear, community downwinders, and evening talks across the beaches of Tarifa.",
    startDate: isoFromNow(3),
    endDate: isoFromNow(5, 18),
    country: "Spain",
    region: "Andalusia",
    city: "Tarifa",
    spotName: "Valdevaqueros",
    latitude: 36.0738,
    longitude: -5.6844,
    eventType: eventType("festival"),
    organizerName: "Tarifa Kite Collective",
    organizerWebsite: "https://kitecalendar.com/demo/tarifa-wind-week",
    sourceUrl: "https://kitecalendar.com/demo/source/tarifa",
    sourceType: "crawled",
    reviewStatus: "approved",
    brands: brands(["Duotone", "North", "Core"]),
    featured: true,
    createdAt: isoAgo(20),
    updatedAt: isoAgo(2),
  },
  {
    id: "evt-leucate-speed",
    title: "Leucate Speed Challenge",
    slug: "leucate-speed-challenge",
    description:
      "Open race heats, speed coaching, and foil sessions on one of the Mediterranean's fastest wind corridors.",
    startDate: isoFromNow(5),
    endDate: isoFromNow(7, 17),
    country: "France",
    region: "Occitanie",
    city: "Leucate",
    spotName: "La Franqui",
    latitude: 42.9322,
    longitude: 3.0334,
    eventType: eventType("race"),
    organizerName: "Leucate Watersports Club",
    organizerWebsite: "https://kitecalendar.com/demo/leucate-speed",
    sourceUrl: "https://kitecalendar.com/demo/source/leucate",
    sourceType: "crawled",
    reviewStatus: "approved",
    brands: brands(["F-One", "Cabrinha", "Flysurfer"]),
    featured: true,
    createdAt: isoAgo(18),
    updatedAt: isoAgo(1),
  },
  {
    id: "evt-fehmarn-expo",
    title: "Fehmarn Kite Expo",
    slug: "fehmarn-kite-expo",
    description:
      "Germany's Baltic demo weekend with board tests, beginner clinics, safety sessions, and brand tents on the beach.",
    startDate: isoFromNow(12),
    endDate: isoFromNow(14, 18),
    country: "Germany",
    region: "Schleswig-Holstein",
    city: "Fehmarn",
    spotName: "Gold",
    latitude: 54.4369,
    longitude: 11.0993,
    eventType: eventType("expo"),
    organizerName: "Baltic Kite Expo",
    organizerWebsite: "https://kitecalendar.com/demo/fehmarn-expo",
    sourceType: "admin_created",
    reviewStatus: "approved",
    brands: brands(["Core", "Eleveight", "Airush"]),
    featured: true,
    createdAt: isoAgo(15),
    updatedAt: isoAgo(3),
  },
  {
    id: "evt-hood-river-qualifier",
    title: "Hood River Big Air Qualifier",
    slug: "hood-river-big-air-qualifier",
    description:
      "A Gorge qualifier weekend with junior heats, pro demos, and sunset brand sessions near the event lawn.",
    startDate: isoFromNow(38),
    endDate: isoFromNow(40, 18),
    country: "United States",
    region: "Oregon",
    city: "Hood River",
    spotName: "Event Site",
    latitude: 45.7134,
    longitude: -121.5113,
    eventType: eventType("competition"),
    organizerName: "Columbia Gorge Kite Series",
    organizerWebsite: "https://kitecalendar.com/demo/hood-river",
    sourceType: "admin_created",
    reviewStatus: "approved",
    brands: brands(["Slingshot", "Naish", "North"]),
    createdAt: isoAgo(30),
    updatedAt: isoAgo(10),
  },
  {
    id: "evt-el-gouna-camp",
    title: "El Gouna Progression Camp",
    slug: "el-gouna-progression-camp",
    description:
      "Flat-water coaching for intermediate riders, with video review, rescue support, and daily gear tuning clinics.",
    startDate: isoFromNow(21),
    endDate: isoFromNow(27, 16),
    country: "Egypt",
    region: "Red Sea",
    city: "El Gouna",
    spotName: "Mangroovy Beach",
    latitude: 27.4075,
    longitude: 33.6782,
    eventType: eventType("training-camp"),
    organizerName: "Red Sea Kite Academy",
    organizerWebsite: "https://kitecalendar.com/demo/el-gouna",
    sourceType: "user_submitted",
    reviewStatus: "approved",
    brands: brands(["Cabrinha", "Duotone"]),
    createdAt: isoAgo(7),
    updatedAt: isoAgo(4),
  },
  {
    id: "evt-cape-town-downwinder",
    title: "Cape Town Community Downwinder",
    slug: "cape-town-community-downwinder",
    description:
      "A social Table View to Big Bay downwinder with local guides, beach cleanup, and post-session meetups.",
    startDate: isoFromNow(68),
    endDate: isoFromNow(68, 18),
    country: "South Africa",
    region: "Western Cape",
    city: "Cape Town",
    spotName: "Table View",
    latitude: -33.8222,
    longitude: 18.4772,
    eventType: eventType("community-meetup"),
    organizerName: "Cape Kite Crew",
    organizerWebsite: "https://kitecalendar.com/demo/cape-town",
    sourceType: "user_submitted",
    reviewStatus: "approved",
    brands: brands(["Other"]),
    createdAt: isoAgo(4),
    updatedAt: isoAgo(4),
  },
];

export const sampleSubmissions: EventSubmission[] = [
  {
    id: "sub-langebaan-demo",
    title: "Langebaan Demo Sunset",
    description: "Demo sessions and foil tryouts near the lagoon, pending organizer confirmation.",
    startDate: isoFromNow(16),
    endDate: isoFromNow(17, 18),
    country: "South Africa",
    region: "Western Cape",
    city: "Langebaan",
    spotName: "Main Beach",
    latitude: -33.0881,
    longitude: 18.0311,
    eventTypeSlug: "demo-day",
    organizerName: "Lagoon Kite Center",
    organizerWebsite: "https://kitecalendar.com/demo/langebaan",
    brandNames: ["North", "Airush"],
    contactEmail: "events@lagoon.example",
    sourceType: "user_submitted",
    reviewStatus: "pending",
    createdAt: isoAgo(1),
    updatedAt: isoAgo(1),
  },
  {
    id: "sub-crawled-dakhla",
    title: "Dakhla Desert Wind Festival",
    description: "Crawled candidate from a tourism calendar. Needs date and organizer verification.",
    startDate: isoFromNow(45),
    endDate: isoFromNow(48, 18),
    country: "Morocco",
    region: "Dakhla-Oued Ed-Dahab",
    city: "Dakhla",
    spotName: "Dakhla Lagoon",
    latitude: 23.6848,
    longitude: -15.9579,
    eventTypeSlug: "festival",
    organizerName: "Dakhla Tourism Board",
    organizerWebsite: "https://kitecalendar.com/demo/dakhla",
    brandNames: ["F-One", "Other"],
    contactEmail: "crawler@kitecalendar.com",
    sourceUrl: "https://kitecalendar.com/demo/source/dakhla-tourism",
    sourceType: "crawled",
    reviewStatus: "pending",
    crawledAt: isoAgo(0),
    createdAt: isoAgo(0),
    updatedAt: isoAgo(0),
  },
  {
    id: "sub-duplicate-tarifa",
    title: "Tarifa Wind Week 2026",
    description: "Possible duplicate of Tarifa Wind Week from another public calendar.",
    startDate: isoFromNow(3),
    endDate: isoFromNow(5, 18),
    country: "Spain",
    region: "Andalusia",
    city: "Tarifa",
    spotName: "Valdevaqueros",
    latitude: 36.0738,
    longitude: -5.6844,
    eventTypeSlug: "festival",
    organizerName: "Tarifa Kite Collective",
    organizerWebsite: "https://kitecalendar.com/demo/tarifa-wind-week",
    brandNames: ["Duotone"],
    contactEmail: "crawler@kitecalendar.com",
    sourceUrl: "https://kitecalendar.com/demo/source/tarifa-duplicate",
    sourceType: "crawled",
    reviewStatus: "duplicate",
    duplicateOfId: "evt-tarifa-wind-week",
    reviewerNote: "Title, date, and spot overlap with approved Tarifa Wind Week.",
    crawledAt: isoAgo(1),
    createdAt: isoAgo(1),
    updatedAt: isoAgo(1),
  },
];
