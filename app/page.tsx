import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-purple opacity-30 blur-[100px]" />
      <div className="absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full bg-pink opacity-25 blur-[100px]" />

      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="font-display font-semibold text-lg">Veloxa</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full border border-line px-4 py-2 text-[13px]">
            Log in
          </Link>
          <Link href="/login" className="rounded-full bg-brand-gradient text-black px-4 py-2 text-[13px] font-semibold">
            Get started
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="font-display font-semibold text-[56px] leading-[1.05]">
          Feel every <span className="bg-brand-gradient bg-clip-text text-transparent">beat.</span>
        </h1>
        <p className="text-dim text-[17px] mt-6 max-w-md mx-auto leading-relaxed">
          A streaming home built for independent artists and the people who find them first.
        </p>
        <Link
          href="/login"
          className="inline-block mt-8 rounded-full bg-brand-gradient text-black px-7 py-3 font-semibold"
        >
          Start listening free
        </Link>
      </section>
    </main>
  );
}
