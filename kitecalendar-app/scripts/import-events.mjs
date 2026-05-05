import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, importEvents } from "./lib/event-importer.mjs";

const fileArg = process.argv[2];
if (!fileArg) throw new Error("Usage: node scripts/import-events.mjs data/curated-events.json");

const client = createClient();

try {
  await client.connect();
  const filePath = path.resolve(process.cwd(), fileArg);
  const records = JSON.parse(await readFile(filePath, "utf8"));
  const imported = await importEvents(client, records);
  console.log(`Imported ${imported.length} events from ${fileArg}`);
} finally {
  await client.end();
}
