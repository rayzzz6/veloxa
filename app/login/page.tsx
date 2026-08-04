"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Waveform } from "@/components/Waveform";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      // signUp succeeds even when email confirmation is required, but there's
      // no session yet in that case — don't redirect, tell the user to confirm.
      if (!data.session) {
        setNotice("Check your email for a confirmation link, then log in below.");
        setMode("login");
        return;
      }
      router.push("/home");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Email not confirmed"
          ? "Please confirm your email first — check your inbox for the confirmation link."
          : error.message
      );
      return;
    }
    router.push("/home");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-purple opacity-30 blur-[100px]" />
      <div className="absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full bg-pink opacity-25 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="glass rounded-[28px] p-8">
          <div className="h-16 mb-6">
            <Waveform active={active} />
          </div>

          <div className="flex rounded-full bg-white/[0.04] border border-white/[0.06] p-1 mb-7">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-full text-[13px] font-medium transition-all"
                style={{
                  color: mode === m ? "#090909" : "rgba(255,255,255,0.5)",
                  background: mode === m ? "linear-gradient(135deg,#7C4DFF,#FF4DA6)" : "transparent",
                }}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="font-display font-semibold text-[22px] mb-1">
            {isSignup ? "Feel every beat" : "Welcome back"}
          </h1>
          <p className="text-dim text-[14px] mb-7">
            {isSignup ? "Create your account to start listening." : "Log in to pick up where you left off."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
            {isSignup && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5 text-[15px] outline-none focus:border-purple"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5 text-[15px] outline-none focus:border-purple"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5 text-[15px] outline-none focus:border-purple"
            />

            {notice && <p className="text-emerald text-[13px]">{notice}</p>}
            {error && <p className="text-danger text-[13px]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-3.5 font-semibold text-black bg-brand-gradient disabled:opacity-60"
            >
              {loading ? "One moment…" : isSignup ? "Create account" : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-center text-dim text-[13px] mt-6">
          {isSignup ? "Already have an account?" : "New to Veloxa?"}{" "}
          <button onClick={() => setMode(isSignup ? "login" : "signup")} className="text-white font-medium">
            {isSignup ? "Log in" : "Create one"}
          </button>
        </p>
      </div>
    </main>
  );
}
