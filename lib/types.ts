export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_artist: boolean;
  is_admin: boolean;
  premium: boolean;
  created_at: string;
};

export type Track = {
  id: string;
  title: string;
  artist_id: string;
  album_id: string | null;
  duration_seconds: number;
  genre: string | null;
  mood: string | null;
  audio_url: string;
  artwork_url: string | null;
  visibility: "public" | "private" | "scheduled";
  release_at: string | null;
  play_count: number;
  created_at: string;
};

export type Playlist = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  cover_url: string | null;
  created_at: string;
};

export type ContentReport = {
  id: string;
  track_id: string;
  reporter_id: string | null;
  reason: string;
  status: "pending" | "approved" | "rejected" | "escalated";
  created_at: string;
};
