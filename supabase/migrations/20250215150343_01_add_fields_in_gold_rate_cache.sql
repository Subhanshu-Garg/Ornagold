ALTER table IF EXISTS goldRateCache
    RENAME COLUMN "goldRateInInr" TO "goldRatePerGramINR";

ALTER table IF EXISTS goldRateCache
    ADD COLUMN "lastUpdatedAt" timestamp with time zone DEFAULT NOW();
