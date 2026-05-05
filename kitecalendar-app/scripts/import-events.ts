import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { eventImportFileSchema, importEvents } from "./lib/event-importer";

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    throw new Error("Usage: npm run db:import -- data/curated-events.json");
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  const raw = await readFile(filePath, "utf8");
  const records = eventImportFileSchema.parse(JSON.parse(raw));
  const imported = await importEvents(records);
  console.log(`Imported ${imported.length} events from ${fileArg}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
