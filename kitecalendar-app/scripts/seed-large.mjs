import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, importEvents } from "./lib/event-importer.mjs";

const spots = [
  ["Spain", "Andalusia", "Tarifa", "Valdevaqueros", 36.0738, -5.6844],
  ["Portugal", "Norte", "Viana do Castelo", "Cabedelo", 41.6818, -8.8291],
  ["France", "Occitanie", "Leucate", "La Franqui", 42.9322, 3.0334],
  ["Germany", "Schleswig-Holstein", "Fehmarn", "Gold", 54.4369, 11.0993],
  ["Netherlands", "South Holland", "The Hague", "Scheveningen", 52.1036, 4.2699],
  ["United States", "Oregon", "Hood River", "Event Site", 45.7134, -121.5113],
  ["United States", "California", "Long Beach", "Belmont Shore", 33.758, -118.139],
  ["Mexico", "Nayarit", "Nuevo Nayarit", "Riviera Nayarit", 20.6948, -105.2945],
  ["Brazil", "Ceara", "Cumbuco", "Cumbuco Beach", -3.627, -38.724],
  ["Brazil", "Ceara", "Taiba", "Taiba Beach", -3.5004, -38.8994],
  ["Morocco", "Dakhla-Oued Ed-Dahab", "Dakhla", "Dakhla Lagoon", 23.6848, -15.9579],
  ["Egypt", "Red Sea", "El Gouna", "Mangroovy Beach", 27.4075, 33.6782],
  ["South Africa", "Western Cape", "Cape Town", "Table View", -33.8222, 18.4772],
  ["South Africa", "Western Cape", "Langebaan", "Main Beach", -33.0881, 18.0311],
  ["Italy", "Calabria", "Gizzeria", "Hang Loose Beach", 38.9345, 16.2229],
  ["Italy", "Trentino", "Torbole", "Lake Garda", 45.8702, 10.8755],
  ["Greece", "South Aegean", "Mykonos", "Korfos Bay", 37.4261, 25.3197],
  ["Turkey", "Mugla", "Akyaka", "Akyaka Beach", 37.0534, 28.3249],
  ["Turkey", "Izmir", "Cesme", "Alacati", 38.2826, 26.3741],
  ["United Arab Emirates", "Abu Dhabi", "Abu Dhabi", "Yas Island", 24.4958, 54.6076],
  ["Australia", "Western Australia", "Perth", "Safety Bay", -32.3066, 115.7194],
  ["Thailand", "Prachuap Khiri Khan", "Hua Hin", "Hua Hin Beach", 12.5684, 99.9577],
  ["Vietnam", "Binh Thuan", "Mui Ne", "Rang Beach", 10.9333, 108.2833],
  ["Cape Verde", "Sal", "Santa Maria", "Kite Beach", 16.6, -22.9],
  ["Dominican Republic", "Puerto Plata", "Cabarete", "Kite Beach", 19.75, -70.41],
  ["Aruba", "Noord", "Hadicurari", "Fisherman's Huts", 12.581, -70.045],
  ["Colombia", "La Guajira", "Cabo de la Vela", "Kite Beach", 12.201, -72.147],
  ["Ireland", "County Kerry", "Brandon Bay", "Brandon Bay", 52.274, -10.02],
  ["Denmark", "North Jutland", "Klitmoller", "Cold Hawaii", 57.041, 8.496],
];

const formats = [
  { suffix: "Demo Day", type: "demo-day", brands: ["Duotone", "North"] },
  { suffix: "Progression Camp", type: "training-camp", brands: ["Cabrinha", "F-One"] },
  { suffix: "Community Downwinder", type: "community-meetup", brands: ["Other"] },
  { suffix: "Brand Testival", type: "brand-activation", brands: ["Core", "Eleveight"] },
  { suffix: "Foil Race Weekend", type: "race", brands: ["Flysurfer", "North"] },
  { suffix: "Kite Festival", type: "festival", brands: ["Slingshot", "Naish", "Airush"] },
];

function generatedEvents(count) {
  return Array.from({ length: count }).map((_, index) => {
    const spot = spots[index % spots.length];
    const format = formats[index % formats.length];
    const monthOffset = Math.floor(index / 14);
    const day = 6 + ((index * 5) % 22);
    const start = new Date(Date.UTC(2026, 5 + monthOffset, day, 10, 0, 0));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + (index % 3));
    end.setUTCHours(18, 0, 0, 0);

    return {
      title: `${spot[3]} ${format.suffix} ${start.getUTCFullYear()}`,
      description:
        "Starter database event generated for launch density. Replace with verified organizer data before using as a sourced public listing.",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      country: spot[0],
      region: spot[1],
      city: spot[2],
      spotName: spot[3],
      latitude: spot[4],
      longitude: spot[5],
      eventTypeSlug: format.type,
      organizerName: "Kitecalendar Starter Dataset",
      organizerWebsite: "https://kitecalendar.com",
      brandNames: [...format.brands],
      sourceType: "admin_created",
      reviewStatus: "approved",
      featured: index < 8,
    };
  });
}

const generatedCount = Number(process.argv.find((arg) => arg.startsWith("--generated="))?.split("=")[1] || 0);
const client = createClient();

try {
  await client.connect();
  const curatedPath = path.resolve(process.cwd(), "data", "curated-events.json");
  const curated = JSON.parse(await readFile(curatedPath, "utf8"));
  const records = [...curated, ...generatedEvents(generatedCount)];
  const imported = await importEvents(client, records);
  console.log(`Seeded ${imported.length} events (${curated.length} curated, ${generatedCount} generated starter events).`);
} finally {
  await client.end();
}
