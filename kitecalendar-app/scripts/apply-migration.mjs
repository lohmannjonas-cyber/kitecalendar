import { createHash, randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL before running migrations.");
}

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
const client = new Client({ connectionString });

async function ensureMigrationsTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) PRIMARY KEY NOT NULL,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    );
  `);
}

async function migrationApplied(name) {
  const result = await client.query('SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = $1', [name]);
  return result.rowCount > 0;
}

async function markApplied(name, sql) {
  const checksum = createHash("sha256").update(sql).digest("hex");
  await client.query(
    `
      INSERT INTO "_prisma_migrations"
        ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
      VALUES
        ($1, $2, now(), $3, NULL, NULL, now(), 1)
    `,
    [randomUUID(), checksum, name],
  );
}

async function main() {
  await client.connect();
  await ensureMigrationsTable();

  const entries = (await readdir(migrationsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const name of entries) {
    if (await migrationApplied(name)) {
      console.log(`Already applied ${name}`);
      continue;
    }

    const sql = await readFile(path.join(migrationsDir, name, "migration.sql"), "utf8");
    console.log(`Applying ${name}`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await markApplied(name, sql);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
