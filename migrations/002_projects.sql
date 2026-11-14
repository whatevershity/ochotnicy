create table if not exists projects (
  id text primary key,
  title text not null,
  teaser text not null default '',
  body text not null default '',
  image_url text,
  image_bytes bytea,
  image_mime text,
  created_at timestamptz not null default now()
);

create index if not exists projects_created_idx on projects (created_at desc);
