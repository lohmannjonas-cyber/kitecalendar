import { randomUUID } from "node:crypto";
import pg from "pg";

const { Client } = pg;

export const brands = [
  ["duotone", "Duotone", "https://www.duotonesports.com", "#0ea5e9"],
  ["north", "North", "https://northkb.com", "#111827"],
  ["core", "Core", "https://corekites.com", "#facc15"],
  ["slingshot", "Slingshot", "https://slingshotsports.com", "#ef4444"],
  ["cabrinha", "Cabrinha", "https://www.cabrinha.com", "#14b8a6"],
  ["f-one", "F-One", "https://www.f-one.world", "#f97316"],
  ["flysurfer", "Flysurfer", "https://flysurfer.com", "#22c55e"],
  ["naish", "Naish", "https://www.naish.com", "#2563eb"],
  ["airush", "Airush", "https://airush.com", "#7c3aed"],
  ["eleveight", "Eleveight", "https://www.eleveightkites.com", "#0891b2"],
  ["ozone", "Ozone", "https://ozonekites.com", "#84cc16"],
  ["other", "Other", null, "#64748b"],
];

export const eventTypes = [
  ["competition", "competition", "Competition", "#0284c7"],
  ["demo-day", "demo-day", "Demo day", "#0d9488"],
  ["festival", "festival", "Festival", "#f97316"],
  ["training-camp", "training-camp", "Training camp", "#16a34a"],
  ["race", "race", "Race", "#dc2626"],
  ["expo", "expo", "Expo", "#7c3aed"],
  ["community-meetup", "community-meetup", "Community meetup", "#0891b2"],
  ["brand-activation", "brand-activation", "Brand activation", "#475569"],
];

export function createClient() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL before importing events.");
  return new Client({ connectionString });
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function ensureTaxonomy(client) {
  for (const [id, name, website, color] of brands) {
    await client.query(
      `
        INSERT INTO "Brand" ("id", "name", "website", "color", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, true, now(), now())
        ON CONFLICT ("name") DO UPDATE SET
          "website" = EXCLUDED."website",
          "color" = EXCLUDED."color",
          "isActive" = true,
          "updatedAt" = now()
      `,
      [id, name, website, color],
    );
  }

  for (const [id, slug, name, color] of eventTypes) {
    await client.query(
      `
        INSERT INTO "EventType" ("id", "slug", "name", "color", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, now(), now())
        ON CONFLICT ("slug") DO UPDATE SET
          "name" = EXCLUDED."name",
          "color" = EXCLUDED."color",
          "updatedAt" = now()
      `,
      [id, slug, name, color],
    );
  }
}

export async function importEvents(client, records) {
  await ensureTaxonomy(client);
  const imported = [];

  for (const record of records) {
    const slug = `${slugify(record.title)}-${new Date(record.startDate).getUTCFullYear()}`;
    const eventTypeId = eventTypes.find((type) => type[1] === record.eventTypeSlug)?.[0];
    if (!eventTypeId) throw new Error(`Unknown event type: ${record.eventTypeSlug}`);

    const result = await client.query(
      `
        INSERT INTO "Event" (
          "id", "title", "slug", "description", "startDate", "endDate", "country", "region", "city", "spotName",
          "latitude", "longitude", "eventTypeId", "organizerName", "organizerWebsite", "sourceUrl", "sourceType",
          "reviewStatus", "featured", "createdAt", "updatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5::timestamp, $6::timestamp, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17::"SourceType",
          $18::"ReviewStatus", $19, now(), now()
        )
        ON CONFLICT ("slug") DO UPDATE SET
          "title" = EXCLUDED."title",
          "description" = EXCLUDED."description",
          "startDate" = EXCLUDED."startDate",
          "endDate" = EXCLUDED."endDate",
          "country" = EXCLUDED."country",
          "region" = EXCLUDED."region",
          "city" = EXCLUDED."city",
          "spotName" = EXCLUDED."spotName",
          "latitude" = EXCLUDED."latitude",
          "longitude" = EXCLUDED."longitude",
          "eventTypeId" = EXCLUDED."eventTypeId",
          "organizerName" = EXCLUDED."organizerName",
          "organizerWebsite" = EXCLUDED."organizerWebsite",
          "sourceUrl" = EXCLUDED."sourceUrl",
          "sourceType" = EXCLUDED."sourceType",
          "reviewStatus" = EXCLUDED."reviewStatus",
          "featured" = EXCLUDED."featured",
          "updatedAt" = now()
        RETURNING "id"
      `,
      [
        randomUUID(),
        record.title,
        slug,
        record.description,
        record.startDate,
        record.endDate,
        record.country,
        record.region || null,
        record.city,
        record.spotName || null,
        record.latitude,
        record.longitude,
        eventTypeId,
        record.organizerName,
        record.organizerWebsite || null,
        record.sourceUrl || null,
        record.sourceType || "admin_created",
        record.reviewStatus || "approved",
        Boolean(record.featured),
      ],
    );

    const eventId = result.rows[0].id;
    await client.query('DELETE FROM "EventBrand" WHERE "eventId" = $1', [eventId]);
    const names = record.brandNames?.length ? record.brandNames : ["Other"];
    const brandResult = await client.query('SELECT "id" FROM "Brand" WHERE "name" = ANY($1)', [names]);
    for (const row of brandResult.rows) {
      await client.query(
        'INSERT INTO "EventBrand" ("eventId", "brandId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [eventId, row.id],
      );
    }

    imported.push(eventId);
  }

  return imported;
}
