import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, importEvents } from "./lib/event-importer.mjs";

const fileArg = process.argv[2] || "data/verified-kite-events-2026.json";
const client = createClient();

try {
  await client.connect();
  const filePath = path.resolve(process.cwd(), fileArg);
  const records = JSON.parse(await readFile(filePath, "utf8"));

  await client.query('DELETE FROM "Forecast"');
  await client.query('DELETE FROM "EventBrand"');
  await client.query('DELETE FROM "Event"');

  const imported = await importEvents(client, records);
  console.log(`Replaced public events with ${imported.length} records from ${fileArg}`);
} finally {
  await client.end();
}
