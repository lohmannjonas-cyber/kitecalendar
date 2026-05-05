import { runDiscoveryCrawl } from "../src/lib/crawler";

async function main() {
  const results = await runDiscoveryCrawl();
  console.table(results);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
