drop policy "Allow shop owners to delete their shops" on "public"."shops";

drop policy "Allow shop owners to update their shops" on "public"."shops";

alter table "public"."reviews" drop constraint "reviews_shopId_fkey";

alter table "public"."reviews" drop constraint "reviews_userId_fkey";

alter table "public"."reviews" drop constraint "reviews_pkey";

drop index if exists "public"."reviews_pkey";

alter table "public"."reviews" alter column "shopId" set not null;

alter table "public"."reviews" alter column "userId" set not null;

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id, comment);

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."reviews" add constraint "reviews_shop_id_fkey" FOREIGN KEY ("shopId") REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_shop_id_fkey";

alter table "public"."reviews" add constraint "reviews_user_id_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_nearby_shops(lat double precision, lng double precision, radius_km double precision)
 RETURNS SETOF shops
 LANGUAGE sql
 STABLE
AS $function$
    SELECT *
    FROM shops
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_km * 1000
    )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
$function$
;

create policy "Allow shop owners to delete their shops"
on "public"."shops"
as permissive
for delete
to authenticated
using ((auth.uid() IN ( SELECT shop_owners."userId" AS user_id
   FROM shop_owners
  WHERE (shop_owners."shopId" = shops.id))));


create policy "Allow shop owners to update their shops"
on "public"."shops"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT shop_owners."userId" AS user_id
   FROM shop_owners
  WHERE (shop_owners."shopId" = shops.id))));



