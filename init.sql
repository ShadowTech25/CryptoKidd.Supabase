create table if not exists articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  slug text unique not null,
  created_at timestamp with time zone default now()
);