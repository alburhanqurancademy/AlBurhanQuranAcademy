export default function DownloadsHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-black-soft)] py-20 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-sky)]/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10">
          <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-[var(--color-accent)] text-xs font-semibold tracking-wider uppercase">Free Resources</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Islamic{" "}
          <span className="relative inline-block">
            <span className="text-[var(--color-accent)]">Library</span>
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          Access our curated collection of free Quranic resources, Tajweed guides, and Islamic learning materials — all available to download at no cost.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-8 mt-2">
          {[
            { value: "7", label: "Collections" },
            { value: "Free", label: "Always" },
            { value: "PDF", label: "Format" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-[var(--color-accent)]">{value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
