import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, premium")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex">
      <Sidebar active="/profile" />
      <main className="flex-1 min-h-screen px-8 pb-16 max-w-2xl">
        <header className="py-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full mascot-orb" />
          <div>
            <h1 className="font-display font-semibold text-xl">{profile?.display_name ?? "Your account"}</h1>
            <p className="text-dim text-[13px]">
              {user.email} {profile?.premium && <span className="text-purple">· Premium</span>}
            </p>
          </div>
        </header>

        <form action="/api/auth/signout" method="post">
          <button className="rounded-full border border-line px-4 py-2 text-[13px]">Log out</button>
        </form>
      </main>
    </div>
  );
}
