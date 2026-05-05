import type { KiteEvent } from "@/lib/types";

export function EventMap({ event }: { event: KiteEvent }) {
  const delta = 0.08;
  const bbox = [
    event.longitude - delta,
    event.latitude - delta,
    event.longitude + delta,
    event.latitude + delta,
  ].join("%2C");
  const marker = `${event.latitude}%2C${event.longitude}`;

  return (
    <div className="overflow-hidden rounded-md border border-sky-100 bg-white shadow-sm">
      <iframe
        title={`${event.title} map`}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
        className="map-embed h-80 w-full"
        loading="lazy"
      />
    </div>
  );
}
