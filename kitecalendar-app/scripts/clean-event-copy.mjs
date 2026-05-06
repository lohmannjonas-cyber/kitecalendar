import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL or DIRECT_URL before cleaning event copy.");
}

const client = new Client({ connectionString });

const CLEANUPS = [
  ["^Verified kite event\\.\\s*", ""],
  ["^Verified\\s+", ""],
  ["^Curated public calendar entry for\\s+", ""],
  ["^Public agenda\\s+", ""],
];

async function cleanTable(tableName) {
  let total = 0;

  for (const [pattern, replacement] of CLEANUPS) {
    const result = await client.query(
      `
        UPDATE "${tableName}"
        SET "description" = regexp_replace("description", $1, $2, 'i'),
            "updatedAt" = now()
        WHERE "description" ~* $1
      `,
      [pattern, replacement],
    );
    total += result.rowCount;
  }

  return total;
}

try {
  await client.connect();
  const events = await cleanTable("Event");
  const submissions = await cleanTable("EventSubmission");
  console.log(`Cleaned ${events} public event descriptions.`);
  console.log(`Cleaned ${submissions} review-queue descriptions.`);
} finally {
  await client.end();
}
