create table IF NOT EXISTS goldRateCache (
    id serial primary key,
    "goldRateInInr" numeric not null,
    timestamp timestamp with time zone default now()
);
