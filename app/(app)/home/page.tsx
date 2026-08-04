import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trending } = await supabase
    .from("tracks")
    .select("id, title, artist_id, artwork_url")
    .eq("visibility", "public")
    .eq("moderation_status", "approved")
    .order("play_count", { ascending: false })
    .limit(8);

  return (
    <div className="flex">
      <Sidebar active="/home" />
      <main className="flex-1 min-h-screen px-8 pb-28">
        <header className="py-6">
          <p className="text-dim text-[13px]">Good evening</p>
          <h1 className="font-display font-semibold text-2xl">Ready for tonight's mix?</h1>
        </header>

        <section>
          <h2 className="text-[15px] font-medium mb-3 text-dim">Trending now</h2>
          {trending && trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trending.map((t) => (
                <div key={t.id} className="rounded-2xl border border-line bg-panel p-4">
                  <div className="aspect-square rounded-xl mascot-orb mb-3" />
                  <p className="text-[13px] truncate">{t.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-dim text-[14px]">
              No approved tracks yet — once artists publish and moderation approves them, they'll show up here.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
