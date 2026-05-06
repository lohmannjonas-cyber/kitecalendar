import pg from "pg";

const { Client } = pg;

const OLD_CURATED_TITLES = [
  "Defi Kite | Defi Wing | Defi Wind 2026",
  "Formula Kite Worlds Viana do Castelo 2026",
  "Dutch Water Week 2026",
  "California GKA Freestyle Kiteboarding World Cup Borkum 2026",
  "Foilie du Lac 2026",
  "GKA Big Air Kite World Cup Greece 2026",
  "Salon du Foil Serre-Poncon 2026",
  "GKA Youth Kite World Championships Tarifa 2026",
  "Formula Kite Gizzeria 2026",
  "Formula Kite Grand Prix Cesme 2026",
  "Formula Kite Youth Worlds Cesme 2026",
  "California Kitesurf Masters St. Peter-Ording 2026",
  "GKA Kite World Cup Sylt 2026",
  "Formula Kite Europeans Akyaka 2026",
  "B2B Kite Summit 2026",
  "Formula Kite Grand Slam Sardinia 2026",
];

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL or DIRECT_URL before removing duplicates.");
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  const oldCurated = await client.query(
    `
      DELETE FROM "Event"
      WHERE "title" = ANY($1)
      RETURNING "title", "country", "city"
    `,
    [OLD_CURATED_TITLES],
  );

  const crawledOverlaps = await client.query(
    `
      DELETE FROM "Event" old
      WHERE old."sourceType" = 'crawled'
        AND EXISTS (
          SELECT 1
          FROM "Event" keeper
          WHERE keeper."id" <> old."id"
            AND keeper."sourceType" <> 'crawled'
            AND lower(keeper."country") = lower(old."country")
            AND lower(keeper."city") = lower(old."city")
            AND date(keeper."startDate") = date(old."startDate")
        )
      RETURNING old."title", old."country", old."city"
    `,
  );

  const duplicateQueue = await client.query(
    `
      DELETE FROM "EventSubmission"
      WHERE "reviewStatus" = 'duplicate'
      RETURNING "title", "country", "city"
    `,
  );

  console.log(`Removed ${oldCurated.rowCount} known older duplicate events.`);
  console.log(`Removed ${crawledOverlaps.rowCount} crawled events that overlapped approved events.`);
  console.log(`Removed ${duplicateQueue.rowCount} duplicate review-queue submissions.`);

  const removed = [...oldCurated.rows, ...crawledOverlaps.rows, ...duplicateQueue.rows];
  if (removed.length) {
    console.log("Removed:");
    for (const row of removed) {
      console.log(`- ${row.title} (${row.city}, ${row.country})`);
    }
  }
}

try {
  await main();
} finally {
  await client.end();
}
