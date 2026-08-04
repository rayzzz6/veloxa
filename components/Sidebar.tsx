import Link from "next/link";
import { Home, Search, Library, Disc3, BarChart3, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/player", label: "Now playing", icon: Disc3 },
];

export async function Sidebar({ active }: { active: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isArtist = false;
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_artist, is_admin")
      .eq("id", user.id)
      .single();
    isArtist = !!profile?.is_artist;
    isAdmin = !!profile?.is_admin;
  }

  return (
    <aside className="w-60 shrink-0 border-r border-white/[0.06] p-5 flex-col justify-between h-screen sticky top-0 hidden md:flex">
      <div>
        <Link href="/" className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple to-pink flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-display font-semibold text-[15px]">Veloxa</span>
        </Link>

        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                active === href ? "bg-purple/15 text-white" : "text-dim hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} className={active === href ? "text-pink" : ""} />
              {label}
            </Link>
          ))}

          {isArtist && (
            <>
              <div className="h-px bg-white/[0.06] my-3" />
              <Link
                href="/artist"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  active === "/artist" ? "bg-purple/15 text-white" : "text-dim hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <BarChart3 size={18} strokeWidth={1.8} />
                Artist studio
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                active === "/admin" ? "bg-purple/15 text-white" : "text-dim hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <ShieldCheck size={18} strokeWidth={1.8} />
              Admin
            </Link>
          )}

          <div className="h-px bg-white/[0.06] my-3" />
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
              active === "/profile" ? "bg-purple/15 text-white" : "text-dim hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <User size={18} strokeWidth={1.8} />
            Profile
          </Link>
        </nav>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-panel p-3 flex items-center gap-2">
        <div className="mascot-orb w-8 h-8 shrink-0" />
        <div className="text-[12px] text-dim leading-snug">Your listening companion is online.</div>
      </div>
    </aside>
  );
}
