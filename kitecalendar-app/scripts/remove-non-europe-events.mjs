import pg from "pg";

const { Client } = pg;

const EUROPE_FOCUS_COUNTRIES = [
  "Albania",
  "Andorra",
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Montenegro",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "United Kingdom",
];

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL or DIRECT_URL before removing non-Europe events.");
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  const eventPreview = await client.query(
    `
      SELECT "title", "country"
      FROM "Event"
      WHERE NOT ("country" = ANY($1))
      ORDER BY "country", "startDate"
    `,
    [EUROPE_FOCUS_COUNTRIES],
  );

  const submissionPreview = await client.query(
    `
      SELECT "title", "country"
      FROM "EventSubmission"
      WHERE NOT ("country" = ANY($1))
      ORDER BY "country", "createdAt"
    `,
    [EUROPE_FOCUS_COUNTRIES],
  );

  const eventDelete = await client.query(
    `
      DELETE FROM "Event"
      WHERE NOT ("country" = ANY($1))
    `,
    [EUROPE_FOCUS_COUNTRIES],
  );

  const submissionDelete = await client.query(
    `
      DELETE FROM "EventSubmission"
      WHERE NOT ("country" = ANY($1))
    `,
    [EUROPE_FOCUS_COUNTRIES],
  );

  console.log(`Removed ${eventDelete.rowCount} public events outside Europe focus.`);
  console.log(`Removed ${submissionDelete.rowCount} review-queue submissions outside Europe focus.`);

  if (eventPreview.rows.length) {
    console.log("Public events removed:");
    for (const row of eventPreview.rows) {
      console.log(`- ${row.title} (${row.country})`);
    }
  }

  if (submissionPreview.rows.length) {
    console.log("Review-queue submissions removed:");
    for (const row of submissionPreview.rows) {
      console.log(`- ${row.title} (${row.country})`);
    }
  }
}

try {
  await main();
} finally {
  await client.end();
}
