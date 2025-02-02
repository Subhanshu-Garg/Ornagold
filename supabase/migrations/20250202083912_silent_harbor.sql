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
    mobile_number text NOT NULL,
    logo_image text,
    making_charges text NOT NULL,
    gold_rate text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    locality text NOT NULL,
    gallery text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    location geography(POINT) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create shop owners junction table
CREATE TABLE IF NOT EXISTS shop_owners (
    shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (shop_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for shops
CREATE POLICY "Allow public read access to shops"
    ON shops
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create shops"
    ON shops
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow shop owners to update their shops"
    ON shops
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id
        FROM shop_owners
        WHERE shop_id = id
    ));

CREATE POLICY "Allow shop owners to delete their shops"
    ON shops
    FOR DELETE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id
        FROM shop_owners
        WHERE shop_id = id
    ));

-- Create policies for reviews
CREATE POLICY "Allow public read access to reviews"
    ON reviews
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create reviews"
    ON reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create function to find nearby shops
CREATE OR REPLACE FUNCTION get_nearby_shops(
    lat double precision,
    lng double precision,
    radius_km double precision
)
RETURNS SETOF shops
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM shops
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_km * 1000
    )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
$$;

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS shops_location_idx ON shops USING GIST (location);

-- Create index for text search
CREATE INDEX IF NOT EXISTS shops_name_idx ON shops USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS shops_locality_idx ON shops USING GIN (to_tsvector('english', locality));