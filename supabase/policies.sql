-- Run after schema.sql. Enables RLS and defines who can read/write what.

alter table profiles enable row level security;
alter table artists enable row level security;
alter table albums enable row level security;
alter table tracks enable row level security;
alter table playlists enable row level security;
alter table playlist_tracks enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table play_history enable row level security;
alter table content_reports enable row level security;

-- Profiles: anyone can read, only the owner can update their own row
create policy "profiles are viewable by everyone" on profiles for select using (true);
create policy "users can update their own profile" on profiles for update using (auth.uid() = id);

-- Tracks: public + approved tracks are visible to everyone;
-- artists can see and manage all of their own tracks regardless of status
create policy "public approved tracks are visible" on tracks for select
  using (visibility = 'public' and moderation_status = 'approved');
create policy "artists manage their own tracks" on tracks for all
  using (auth.uid() = artist_id);

-- Playlists: public playlists visible to all, private only to the owner
create policy "public playlists are visible" on playlists for select using (is_public = true);
create policy "owners see their own playlists" on playlists for select using (auth.uid() = owner_id);
create policy "owners manage their own playlists" on playlists for all using (auth.uid() = owner_id);

-- Likes / follows / history: users manage only their own rows
create policy "users manage their own likes" on likes for all using (auth.uid() = user_id);
create policy "users manage their own follows" on follows for all using (auth.uid() = follower_id);
create policy "users manage their own history" on play_history for all using (auth.uid() = user_id);

-- Content reports: any signed-in user can file one; only admins can update status
create policy "users can file reports" on content_reports for insert with check (auth.uid() is not null);
create policy "admins manage reports" on content_reports for all
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
