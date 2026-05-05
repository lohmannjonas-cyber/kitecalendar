-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('user_submitted', 'crawled', 'admin_created');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected', 'duplicate');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin');

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT NOT NULL,
    "spotName" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "robotsCheckedAt" TIMESTAMP(3),
    "termsNote" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCrawledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawlSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT NOT NULL,
    "spotName" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerWebsite" TEXT,
    "sourceUrl" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "locationId" TEXT,
    "crawlSourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventBrand" (
    "eventId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "EventBrand_pkey" PRIMARY KEY ("eventId","brandId")
);

-- CreateTable
CREATE TABLE "EventSubmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT NOT NULL,
    "spotName" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "eventTypeSlug" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerWebsite" TEXT,
    "brandNames" TEXT[],
    "contactEmail" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "duplicateOfId" TEXT,
    "reviewerNote" TEXT,
    "crawledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forecast" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "averageKnots" DOUBLE PRECISION NOT NULL,
    "gustKnots" DOUBLE PRECISION NOT NULL,
    "direction" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "brandNames" TEXT[],
    "minRating" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_country_region_city_spotName_key" ON "Location"("country", "region", "city", "spotName");
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
CREATE UNIQUE INDEX "EventType_slug_key" ON "EventType"("slug");
CREATE UNIQUE INDEX "CrawlSource_baseUrl_key" ON "CrawlSource"("baseUrl");
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_reviewStatus_startDate_idx" ON "Event"("reviewStatus", "startDate");
CREATE INDEX "Event_country_city_idx" ON "Event"("country", "city");
CREATE INDEX "Event_sourceUrl_idx" ON "Event"("sourceUrl");
CREATE INDEX "EventSubmission_reviewStatus_createdAt_idx" ON "EventSubmission"("reviewStatus", "createdAt");
CREATE INDEX "EventSubmission_sourceUrl_idx" ON "EventSubmission"("sourceUrl");
CREATE UNIQUE INDEX "Forecast_eventId_forecastDate_provider_key" ON "Forecast"("eventId", "forecastDate", "provider");
CREATE INDEX "Forecast_forecastDate_idx" ON "Forecast"("forecastDate");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "AlertSubscription_email_idx" ON "AlertSubscription"("email");
CREATE INDEX "AlertSubscription_country_idx" ON "AlertSubscription"("country");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_crawlSourceId_fkey" FOREIGN KEY ("crawlSourceId") REFERENCES "CrawlSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EventBrand" ADD CONSTRAINT "EventBrand_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventBrand" ADD CONSTRAINT "EventBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
