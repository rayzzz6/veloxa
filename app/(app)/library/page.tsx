import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function LibraryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: playlists } = await supabase
    .from("playlists")
    .select("id, title, cover_url")
    .eq("owner_id", user.id);

  return (
    <div className="flex">
      <Sidebar active="/library" />
      <main className="flex-1 min-h-screen px-8 pb-16">
        <header className="flex items-center justify-between py-6">
          <h1 className="font-display font-semibold text-2xl">Your library</h1>
          <button className="rounded-full bg-brand-gradient text-black px-4 py-2 text-[13px] font-semibold">
            + New playlist
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {playlists && playlists.length > 0 ? (
            playlists.map((p) => (
              <div key={p.id}>
                <div className="aspect-square rounded-xl mascot-orb" />
                <p className="text-[13px] mt-2 truncate">{p.title}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-line p-8 text-center text-dim text-[14px]">
              No playlists yet. Create one to start organizing tracks.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
