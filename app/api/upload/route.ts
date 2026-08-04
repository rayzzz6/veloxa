import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Expects multipart/form-data with fields:
// audio (File), title, genre, mood, visibility ('public' | 'private' | 'scheduled'), release_at (optional ISO date)
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_artist")
    .eq("id", user.id)
    .single();
  if (!profile?.is_artist) {
    return NextResponse.json({ error: "Only verified artist accounts can upload" }, { status: 403 });
  }

  const form = await req.formData();
  const audio = form.get("audio") as File | null;
  const title = form.get("title") as string | null;
  const genre = (form.get("genre") as string | null) ?? null;
  const mood = (form.get("mood") as string | null) ?? null;
  const visibility = (form.get("visibility") as string | null) ?? "private";
  const releaseAt = (form.get("release_at") as string | null) ?? null;

  if (!audio || !title) {
    return NextResponse.json({ error: "title and audio are required" }, { status: 400 });
  }

  const allowedTypes = ["audio/mpeg", "audio/flac", "audio/wav", "audio/aac", "audio/ogg"];
  if (!allowedTypes.includes(audio.type)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 400 });
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_TRACKS_BUCKET ?? "tracks";
  const path = `${user.id}/${Date.now()}-${audio.name}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, audio, {
    contentType: audio.type,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);

  const { data: track, error: insertError } = await supabase
    .from("tracks")
    .insert({
      title,
      artist_id: user.id,
      genre,
      mood,
      audio_url: publicUrl.publicUrl,
      visibility,
      release_at: releaseAt,
      moderation_status: "pending",
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ track }, { status: 201 });
}
