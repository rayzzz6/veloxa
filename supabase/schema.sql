-- Run in the Supabase SQL editor. Assumes auth.users already exists (Supabase Auth).

create extension if not exists "uuid-ossp";

-- One row per authenticated user, extending auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  is_artist boolean not null default false,
  is_admin boolean not null default false,
  premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table artists (
  id uuid primary key references profiles(id) on delete cascade,
  bio text,
  verified boolean not null default false,
  monthly_listeners int not null default 0,
  created_at timestamptz not null default now()
);

create table albums (
  id uuid primary key default uuid_generate_v4(),
  artist_id uuid not null references artists(id) on delete cascade,
  title text not null,
  cover_url text,
  release_at timestamptz,
  created_at timestamptz not null default now()
);

create table tracks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist_id uuid not null references artists(id) on delete cascade,
  album_id uuid references albums(id) on delete set null,
  duration_seconds int not null default 0,
  genre text,
  mood text,
  audio_url text not null,
  artwork_url text,
  lyrics text,
  visibility text not null default 'private' check (visibility in ('public','private','scheduled')),
  release_at timestamptz,
  play_count bigint not null default 0,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table playlists (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default true,
  cover_url text,
  created_at timestamptz not null default now()
);

create table playlist_tracks (
  playlist_id uuid not null references playlists(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  position int not null default 0,
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);

create table likes (
  user_id uuid not null references profiles(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table follows (
  follower_id uuid not null references profiles(id) on delete cascade,
  artist_id uuid not null references artists(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, artist_id)
);

create table play_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  played_at timestamptz not null default now()
);

create table content_reports (
  id uuid primary key default uuid_generate_v4(),
  track_id uuid not null references tracks(id) on delete cascade,
  reporter_id uuid references profiles(id) on delete set null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','escalated')),
  created_at timestamptz not null default now()
);

-- Keep monthly_listeners / play_count roughly in sync via trigger (simplified)
create or replace function increment_play_count()
returns trigger as $$
begin
  update tracks set play_count = play_count + 1 where id = new.track_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_increment_play_count
after insert on play_history
for each row execute function increment_play_count();

-- New auth.users row automatically gets a profile
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_handle_new_user
after insert on auth.users
for each row execute function handle_new_user();
