import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const genre = req.nextUrl.searchParams.get("genre");

  const supabase = createClient();
  let query = supabase
    .from("tracks")
    .select("id, title, genre, mood, artwork_url, play_count, duration_seconds, artist_id")
    .eq("visibility", "public")
    .eq("moderation_status", "approved")
    .order("play_count", { ascending: false })
    .limit(50);

  if (q) query = query.ilike("title", `%${q}%`);
  if (genre) query = query.eq("genre", genre);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ tracks: data });
}
