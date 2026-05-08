import type { Brand, EventType } from "@/lib/types";

export const BRANDS: Brand[] = [
  { id: "duotone", name: "Duotone", color: "#0ea5e9", website: "https://www.duotonesports.com" },
  { id: "north", name: "North", color: "#111827", website: "https://northkb.com" },
  { id: "core", name: "Core", color: "#facc15", website: "https://corekites.com" },
  { id: "slingshot", name: "Slingshot", color: "#ef4444", website: "https://slingshotsports.com" },
  { id: "cabrinha", name: "Cabrinha", color: "#14b8a6", website: "https://www.cabrinha.com" },
  { id: "f-one", name: "F-One", color: "#f97316", website: "https://www.f-one.world" },
  { id: "flysurfer", name: "Flysurfer", color: "#22c55e", website: "https://flysurfer.com" },
  { id: "naish", name: "Naish", color: "#2563eb", website: "https://www.naish.com" },
  { id: "airush", name: "Airush", color: "#7c3aed", website: "https://airush.com" },
  { id: "eleveight", name: "Eleveight", color: "#0891b2", website: "https://www.eleveightkites.com" },
  { id: "ozone", name: "Ozone", color: "#84cc16", website: "https://ozonekites.com" },
  { id: "lakeunited", name: "LakeUnited", color: "#0284c7", website: "https://www.lakeunited.com" },
  { id: "other", name: "Other", color: "#64748b" },
];

export const EVENT_TYPES: EventType[] = [
  { id: "competition", slug: "competition", name: "Competition", color: "#0284c7" },
  { id: "demo-day", slug: "demo-day", name: "Brand Demo", color: "#111827" },
  { id: "festival", slug: "festival", name: "Festival", color: "#f97316" },
  { id: "training-camp", slug: "training-camp", name: "Training camp", color: "#16a34a" },
  { id: "race", slug: "race", name: "Race", color: "#dc2626" },
  { id: "expo", slug: "expo", name: "Expo", color: "#7c3aed" },
  { id: "community-meetup", slug: "community-meetup", name: "Community meetup", color: "#0891b2" },
  { id: "brand-activation", slug: "brand-activation", name: "Brand activation", color: "#475569" },
];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
