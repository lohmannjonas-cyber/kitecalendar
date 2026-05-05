import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { BRANDS, EVENT_TYPES } from "../src/lib/constants";
import { sampleEvents, sampleSubmissions } from "../src/lib/sample-data";

async function main() {
  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: { color: brand.color, website: brand.website },
      create: { id: brand.id, name: brand.name, color: brand.color, website: brand.website },
    });
  }

  for (const type of EVENT_TYPES) {
    await prisma.eventType.upsert({
      where: { slug: type.slug },
      update: { name: type.name, color: type.color },
      create: { id: type.id, slug: type.slug, name: type.name, color: type.color },
    });
  }

  for (const event of sampleEvents) {
    const created = await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        description: event.description,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        country: event.country,
        region: event.region,
        city: event.city,
        spotName: event.spotName,
        latitude: event.latitude,
        longitude: event.longitude,
        organizerName: event.organizerName,
        organizerWebsite: event.organizerWebsite,
        sourceUrl: event.sourceUrl,
        sourceType: event.sourceType,
        reviewStatus: event.reviewStatus,
        featured: Boolean(event.featured),
        eventTypeId: event.eventType.id,
      },
      create: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        country: event.country,
        region: event.region,
        city: event.city,
        spotName: event.spotName,
        latitude: event.latitude,
        longitude: event.longitude,
        organizerName: event.organizerName,
        organizerWebsite: event.organizerWebsite,
        sourceUrl: event.sourceUrl,
        sourceType: event.sourceType,
        reviewStatus: event.reviewStatus,
        featured: Boolean(event.featured),
        eventTypeId: event.eventType.id,
      },
    });

    for (const brand of event.brands) {
      await prisma.eventBrand.upsert({
        where: { eventId_brandId: { eventId: created.id, brandId: brand.id } },
        update: {},
        create: { eventId: created.id, brandId: brand.id },
      });
    }
  }

  for (const submission of sampleSubmissions) {
    await prisma.eventSubmission.upsert({
      where: { id: submission.id },
      update: {
        reviewStatus: submission.reviewStatus,
        reviewerNote: submission.reviewerNote,
        duplicateOfId: submission.duplicateOfId,
      },
      create: {
        id: submission.id,
        title: submission.title,
        description: submission.description,
        startDate: new Date(submission.startDate),
        endDate: new Date(submission.endDate),
        country: submission.country,
        region: submission.region,
        city: submission.city,
        spotName: submission.spotName,
        latitude: submission.latitude,
        longitude: submission.longitude,
        eventTypeSlug: submission.eventTypeSlug,
        organizerName: submission.organizerName,
        organizerWebsite: submission.organizerWebsite,
        brandNames: submission.brandNames,
        contactEmail: submission.contactEmail,
        sourceUrl: submission.sourceUrl,
        sourceType: submission.sourceType,
        reviewStatus: submission.reviewStatus,
        duplicateOfId: submission.duplicateOfId,
        reviewerNote: submission.reviewerNote,
        crawledAt: submission.crawledAt ? new Date(submission.crawledAt) : undefined,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kitecalendar.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-this-before-production";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Kitecalendar Admin",
      passwordHash: await hash(adminPassword, 12),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
