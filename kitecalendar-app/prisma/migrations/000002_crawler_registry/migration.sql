ALTER TABLE "CrawlSource"
ADD COLUMN IF NOT EXISTS "crawlFrequency" TEXT NOT NULL DEFAULT 'weekly',
ADD COLUMN IF NOT EXISTS "parserType" TEXT NOT NULL DEFAULT 'html',
ADD COLUMN IF NOT EXISTS "confidence" INTEGER NOT NULL DEFAULT 50;

CREATE TABLE IF NOT EXISTS "CrawlerRun" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "eventsFound" INTEGER NOT NULL DEFAULT 0,
    "eventsQueued" INTEGER NOT NULL DEFAULT 0,
    "duplicates" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "robotsAllowed" BOOLEAN,
    "log" JSONB,

    CONSTRAINT "CrawlerRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CrawlerRun_sourceId_startedAt_idx" ON "CrawlerRun"("sourceId", "startedAt");
CREATE INDEX IF NOT EXISTS "CrawlerRun_status_startedAt_idx" ON "CrawlerRun"("status", "startedAt");

ALTER TABLE "CrawlerRun"
ADD CONSTRAINT "CrawlerRun_sourceId_fkey"
FOREIGN KEY ("sourceId") REFERENCES "CrawlSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
