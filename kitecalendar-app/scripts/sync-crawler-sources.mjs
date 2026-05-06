import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import "dotenv/config";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) throw new Error("Set DATABASE_URL or DIRECT_URL.");

const sourcesPath = path.resolve(process.cwd(), "data", "crawler-sources.json");
const sources = JSON.parse(await readFile(sourcesPath, "utf8"));
const client = new Client({ connectionString });
const force = process.argv.includes("--force") || process.env.FORCE_SOURCE_SYNC === "true";

try {
  await client.connect();
  for (const source of sources) {
    if (force) {
      await client.query(
        `
        INSERT INTO "CrawlSource" (
          "id", "name", "baseUrl", "sourceType", "crawlFrequency", "parserType", "confidence",
          "termsNote", "isActive", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "baseUrl" = EXCLUDED."baseUrl",
          "sourceType" = EXCLUDED."sourceType",
          "crawlFrequency" = EXCLUDED."crawlFrequency",
          "parserType" = EXCLUDED."parserType",
          "confidence" = EXCLUDED."confidence",
          "termsNote" = EXCLUDED."termsNote",
          "isActive" = EXCLUDED."isActive",
          "updatedAt" = now()
      `,
        [
          source.id,
          source.name,
          source.baseUrl,
          source.sourceType,
          source.crawlFrequency,
          source.parserType,
          source.confidence,
          source.termsNote,
          source.isActive !== false,
        ],
      );
    } else {
      await client.query(
        `
        INSERT INTO "CrawlSource" (
          "id", "name", "baseUrl", "sourceType", "crawlFrequency", "parserType", "confidence",
          "termsNote", "isActive", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())
        ON CONFLICT ("id") DO NOTHING
      `,
        [
          source.id,
          source.name,
          source.baseUrl,
          source.sourceType,
          source.crawlFrequency,
          source.parserType,
          source.confidence,
          source.termsNote,
          source.isActive !== false,
        ],
      );
    }
  }

  if (force) {
    await client.query('UPDATE "CrawlSource" SET "isActive" = false, "updatedAt" = now() WHERE "baseUrl" <> ALL($1)', [
      sources.map((source) => source.baseUrl),
    ]);
  }

  const counts = await client.query('SELECT "isActive", count(*)::int FROM "CrawlSource" GROUP BY "isActive" ORDER BY "isActive" DESC');
  console.log(
    JSON.stringify(
      {
        mode: force ? "force-reset-from-code" : "insert-missing-only",
        counts: counts.rows,
      },
      null,
      2,
    ),
  );
} finally {
  await client.end();
}
