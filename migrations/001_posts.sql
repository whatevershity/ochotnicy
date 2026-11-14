create table if not exists posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  date text not null,
  excerpt text not null default '',
  body text not null default '',
  kind text not null default 'aktualnosc',
  list_only boolean not null default false,
  image_url text,
  image_bytes bytea,
  image_mime text,
  created_at timestamptz not null default now()
);

create index if not exists posts_date_idx on posts (date desc);
