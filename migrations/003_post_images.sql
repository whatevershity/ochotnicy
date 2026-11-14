create table if not exists post_images (
  id text primary key,
  post_id text not null references posts (id) on delete cascade,
  sort_order integer not null default 0,
  image_url text,
  image_bytes bytea,
  image_mime text,
  created_at timestamptz not null default now()
);

create index if not exists post_images_post_idx on post_images (post_id, sort_order);
