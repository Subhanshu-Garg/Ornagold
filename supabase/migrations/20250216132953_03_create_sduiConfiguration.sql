CREATE TABLE IF NOT EXISTS "sduiConfigurations" (
    key TEXT NOT NULL UNIQUE PRIMARY KEY,
    config JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "sduiConfigurations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read"
    ON "sduiConfigurations"
    FOR SELECT
    USING (true);

REVOKE UPDATE ON TABLE "sduiConfigurations" FROM anon, authenticated;