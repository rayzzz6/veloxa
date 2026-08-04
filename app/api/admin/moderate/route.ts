import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const form = await req.formData();
  const trackId = form.get("track_id") as string;
  const decision = form.get("decision") as string; // 'approved' | 'rejected'

  if (!trackId || !["approved", "rejected"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabase.from("tracks").update({ moderation_status: decision }).eq("id", trackId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL("/admin", req.url));
}
