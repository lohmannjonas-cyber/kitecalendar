import { z } from "zod";
import { BRANDS, EVENT_TYPES } from "../../src/lib/constants";
import { prisma } from "../../src/lib/prisma";
import { slugify } from "../../src/lib/utils";

export const eventImportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.string(),
  endDate: z.string(),
  country: z.string().min(2),
  region: z.string().optional(),
  city: z.string().min(2),
  spotName: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  eventTypeSlug: z.string(),
  organizerName: z.string().min(2),
  organizerWebsite: z.string().optional(),
  brandNames: z.array(z.string()).default(["Other"]),
  sourceUrl: z.string().optional(),
  sourceType: z.enum(["user_submitted", "crawled", "admin_created"]).default("admin_created"),
  reviewStatus: z.enum(["pending", "approved", "rejected", "duplicate"]).default("approved"),
  featured: z.boolean().optional(),
});

export const eventImportFileSchema = z.array(eventImportSchema);

export type EventImportRecord = z.infer<typeof eventImportSchema>;

export async function ensureTaxonomy() {
  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: { website: brand.website, color: brand.color, isActive: true },
      create: { id: brand.id, name: brand.name, website: brand.website, color: brand.color, isActive: true },
    });
  }

  for (const type of EVENT_TYPES) {
    await prisma.eventType.upsert({
      where: { slug: type.slug },
      update: { name: type.name, color: type.color },
      create: { id: type.id, slug: type.slug, name: type.name, color: type.color },
    });
  }
}

export async function importEvents(records: EventImportRecord[]) {
  await ensureTaxonomy();

  const results = [];
  for (const record of records) {
    const type = await prisma.eventType.findUniqueOrThrow({ where: { slug: record.eventTypeSlug } });
    const slug = `${slugify(record.title)}-${new Date(record.startDate).getUTCFullYear()}`;
    const event = await prisma.event.upsert({
      where: { slug },
      update: {
        title: record.title,
        description: record.description,
        startDate: new Date(record.startDate),
        endDate: new Date(record.endDate),
        country: record.country,
        region: record.region,
        city: record.city,
        spotName: record.spotName,
        latitude: record.latitude,
        longitude: record.longitude,
        eventTypeId: type.id,
        organizerName: record.organizerName,
        organizerWebsite: record.organizerWebsite,
        sourceUrl: record.sourceUrl,
        sourceType: record.sourceType,
        reviewStatus: record.reviewStatus,
        featured: Boolean(record.featured),
      },
      create: {
        title: record.title,
        slug,
        description: record.description,
        startDate: new Date(record.startDate),
        endDate: new Date(record.endDate),
        country: record.country,
        region: record.region,
        city: record.city,
        spotName: record.spotName,
        latitude: record.latitude,
        longitude: record.longitude,
        eventTypeId: type.id,
        organizerName: record.organizerName,
        organizerWebsite: record.organizerWebsite,
        sourceUrl: record.sourceUrl,
        sourceType: record.sourceType,
        reviewStatus: record.reviewStatus,
        featured: Boolean(record.featured),
      },
    });

    const brands = await prisma.brand.findMany({
      where: { name: { in: record.brandNames.length ? record.brandNames : ["Other"] } },
    });
    await prisma.eventBrand.deleteMany({ where: { eventId: event.id } });
    await prisma.eventBrand.createMany({
      data: brands.map((brand) => ({ eventId: event.id, brandId: brand.id })),
      skipDuplicates: true,
    });

    results.push(event);
  }

  return results;
}
