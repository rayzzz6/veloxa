import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/home");

  const { data: pending } = await supabase
    .from("tracks")
    .select("id, title, genre, created_at, artist_id")
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="flex">
      <Sidebar active="/admin" />
      <main className="flex-1 min-h-screen px-8 pb-16">
        <header className="py-6">
          <h1 className="font-display font-semibold text-2xl">Admin panel</h1>
          <p className="text-dim text-[13px] mt-1">Content moderation queue</p>
        </header>

        <div className="rounded-2xl border border-line bg-panel divide-y divide-line">
          {pending && pending.length > 0 ? (
            pending.map((t) => (
              <form key={t.id} action="/api/admin/moderate" method="post" className="p-4 flex items-center gap-4">
                <input type="hidden" name="track_id" value={t.id} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px]">{t.title}</p>
                  <p className="text-dim text-[12px]">{t.genre ?? "Uncategorized"}</p>
                </div>
                <button
                  name="decision"
                  value="approved"
                  className="text-[12px] px-3 py-1 rounded-full bg-emerald/15 text-emerald"
                >
                  Approve
                </button>
                <button
                  name="decision"
                  value="rejected"
                  className="text-[12px] px-3 py-1 rounded-full bg-danger/15 text-danger"
                >
                  Reject
                </button>
              </form>
            ))
          ) : (
            <p className="p-6 text-dim text-[14px]">Nothing pending review.</p>
          )}
        </div>
      </main>
    </div>
  );
}
