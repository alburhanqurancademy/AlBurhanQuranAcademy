import IslamicPatternOverlay from "@/components/IslamicPatternOverlay";

export default function TeamHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-black-soft)] py-20 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-sky)]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/8 rounded-full blur-3xl" />
      </div>

      {/* Shared Islamic line pattern */}
      <IslamicPatternOverlay opacity={0.1} size={76} />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <p className="text-[var(--color-accent)] text-xs font-bold tracking-[0.3em] uppercase mb-3">
          The People Behind the Mission
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-white">
          Meet Our <span className="text-[var(--color-accent)]">Team</span>
        </h1>

        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-sky)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-sky)]" />
        </div>

        <p className="text-gray-400 mt-5 text-base max-w-xl mx-auto leading-relaxed">
          Dedicated scholars and educators committed to guiding every student on their Quranic journey.
        </p>
      </div>
    </section>
  );
}
