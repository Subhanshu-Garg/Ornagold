/*
  # Gold Platform Database Schema

  1. New Tables
    - `shops`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `mobile_number` (text)
      - `logo_image` (text, URL)
      - `making_charges` (text)
      - `gold_rate` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `locality` (text)
      - `gallery` (text[], array of image URLs)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reviews`
      - `id` (uuid, primary key)
      - `shop_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_name` (text)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create reviews
    - Add policies for shop owners to manage their shops

  3. Functions
    - Create function for finding nearby shops using PostGIS
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "logoImage" text,
    "makingCharges" text NOT NULL,
    "goldRate" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    locality text NOT NULL,
    gallery text[],
    "createdAt" timestamptz DEFAULT now(),
    "updatedAt" timestamptz DEFAULT now(),
    location geography(POINT) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "shopId" uuid REFERENCES shops(id) ON DELETE CASCADE,
    "userId" uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    "displayName" text,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text NOT NULL,
    "createdAt" timestamptz DEFAULT now()
);

-- Create shop owners junction table
CREATE TABLE IF NOT EXISTS shop_owners (
    "shopId" uuid REFERENCES shops(id) ON DELETE CASCADE,
    "userId" uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY ("shopId", "userId")
);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Conditional Creation of Policies for shops
DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to shops') THEN
        CREATE POLICY "Allow public read access to shops"
            ON shops
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to create shops') THEN
        CREATE POLICY "Allow authenticated users to create shops"
            ON shops
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow shop owners to update their shops') THEN
        CREATE POLICY "Allow shop owners to update their shops"
            ON shops
            FOR UPDATE
            TO authenticated
            USING (auth.uid() IN (
                SELECT "userId"
                FROM shop_owners
                WHERE "shopId" = id
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow shop owners to delete their shops') THEN
        CREATE POLICY "Allow shop owners to delete their shops"
            ON shops
            FOR DELETE
            TO authenticated
            USING (auth.uid() IN (
                SELECT "userId"
                FROM shop_owners
                WHERE "shopId" = id
            ));
    END IF;

    -- Check if the policy exists before creating it for reviews
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to reviews') THEN
        CREATE POLICY "Allow public read access to reviews"
            ON reviews
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to create reviews') THEN
        CREATE POLICY "Allow authenticated users to create reviews"
            ON reviews
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = "userId");
    END IF;
END $$;


-- Create function to find nearby shops
CREATE OR REPLACE FUNCTION "getNearbyShops"(
    "lat" double precision,
    "lng" double precision,
    "radiusKm" double precision
)
RETURNS SETOF shops
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM shops
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint("lng", "lat"), 4326)::geography,
        "radiusKm" * 1000
    )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint("lng", "lat"), 4326)::geography;
$$;

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS shops_location_idx ON shops USING GIST (location);

-- Create index for text search
CREATE INDEX IF NOT EXISTS shops_name_idx ON shops USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS shops_locality_idx ON shops USING GIN (to_tsvector('english', locality));