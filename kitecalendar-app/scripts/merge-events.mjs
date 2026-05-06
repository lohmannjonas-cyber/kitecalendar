import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, importEvents, slugify } from "./lib/event-importer.mjs";

const fileArg = process.argv[2] || "data/verified-kite-events-2026.json";
const client = createClient();

const LEGACY_DUPLICATE_TITLES = [
  "GKA Freestyle Kite World Cup Germany Borkum 2026",
  "GKA Big Air Kite World Cup Greece 2026",
  "GKA Youth Freestyle Kite World Championship St Peter-Ording 2026",
  "GKA Youth Freestyle Kite World Championship St. Peter-Ording 2026",
  "California Kitesurf Masters St. Peter-Ording 2026",
  "Formula Kite World Championships Viana do Castelo 2026",
  "Formula Kite Youth European Championships Gizzeria 2026",
  "Formula Kite Europeans Akyaka 2026",
  "Formula Kite Youth Europeans Torregrande 2026",
  "Formula Kite Grand Slam Sardinia 2026",
];

function canonicalKeys(records) {
  return records.map((record) => ({
    title: record.title,
    slug: `${slugify(record.title)}-${new Date(record.startDate).getUTCFullYear()}`,
    country: record.country,
    city: record.city,
    startDate: record.startDate.slice(0, 10),
  }));
}

try {
  await client.connect();
  const filePath = path.resolve(process.cwd(), fileArg);
  const records = JSON.parse(await readFile(filePath, "utf8"));
  const imported = await importEvents(client, records);
  const canonical = canonicalKeys(records);
  const canonicalSlugs = canonical.map((event) => event.slug);

  const legacyDuplicates = await client.query(
    `
      DELETE FROM "Event" old
      WHERE old."title" = ANY($1)
        AND NOT (old."slug" = ANY($2))
      RETURNING old."title", old."country", old."city"
    `,
    [LEGACY_DUPLICATE_TITLES, canonicalSlugs],
  );

  let overlapCount = 0;
  for (const event of canonical) {
    const result = await client.query(
      `
        DELETE FROM "Event" old
        WHERE old."slug" <> $1
          AND lower(old."country") = lower($2)
          AND lower(old."city") = lower($3)
          AND date(old."startDate") = $4::date
          AND (
            old."sourceType" = 'crawled'
            OR old."title" = ANY($5)
          )
        RETURNING old."title"
      `,
      [event.slug, event.country, event.city, event.startDate, LEGACY_DUPLICATE_TITLES],
    );
    overlapCount += result.rowCount;
  }

  console.log(`Merged ${imported.length} events from ${fileArg}`);
  console.log(`Removed ${legacyDuplicates.rowCount + overlapCount} duplicate legacy event records.`);
  console.log("Unique older events were kept.");
} finally {
  await client.end();
}
