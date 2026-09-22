import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative bg-[var(--color-black-soft)] overflow-hidden py-20 px-4">
      {/* Ambient background glows — keep the space feeling designed, not empty */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[var(--color-sky)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[480px] h-[480px] rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">

        {/* Left — text */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[var(--color-accent)]" />
            <p className="text-[var(--color-sky)] uppercase tracking-[0.3em] text-xs md:text-sm font-semibold">
              Meet Our Founder
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            About <span className="text-[var(--color-accent)]">Us</span>
          </h2>
          <div className="flex flex-col gap-4 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              <span className="text-[var(--color-accent)]">AL Burhan Quran Academy</span> committed to providing authentic Islamic education to students around the world.
              Our academy is managed by a passionate team of professionals who strive to make Quran learning simple,
              accessible, and meaningful for everyone.
            </p>
            <p>
              We warmly welcome students of all ages and backgrounds, regardless of race, color, or nationality.
              Our goal is to help every Muslim understand the teachings of the Holy Quran and follow the core
              principles of Islam in their daily lives.
            </p>
            <p>
              We believe that by spreading true knowledge of the Quran, we can contribute towards building a
              stronger Ummah and a more peaceful and positive society.
            </p>
          </div>
        </div>

        {/* Right — CEO portrait, shown at its true aspect ratio (no cropping) */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px]">

            {/* Offset color panels — fill the space around the photo instead of cropping it */}
            <div className="absolute -top-5 -right-5 w-full h-full rounded-2xl bg-gradient-to-br from-[var(--color-sky)]/25 to-[var(--color-sky)]/5 pointer-events-none" />
            <div className="absolute -bottom-5 -left-5 w-full h-full rounded-2xl bg-gradient-to-tr from-[var(--color-accent)]/25 to-[var(--color-accent)]/5 pointer-events-none" />

            {/* Dot grid accents */}
            <div
              className="absolute -top-8 -left-8 w-24 h-24 opacity-25 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-sky) 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-24 h-24 opacity-25 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-accent) 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Ambient glow directly behind the card */}
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[var(--color-sky)]/20 via-transparent to-[var(--color-accent)]/20 blur-2xl pointer-events-none" />

            {/* Photo card — aspect-[3/4] matches the source image exactly, so it's never cropped */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
              <Image
                src="/Alburhan CEO.jpeg"
                alt="Prof. H. Ateeq ur Rehman — Founder &amp; CEO, AL Burhan Quran Academy"
                fill
                sizes="(max-width: 1024px) 85vw, 420px"
                className="object-cover object-center"
                priority
              />
              {/* Subtle brand-tinted grade, kept inside the frame */}
              <div className="absolute inset-0 mix-blend-soft-light bg-gradient-to-br from-[var(--color-sky)]/35 via-transparent to-[var(--color-accent)]/30 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
            </div>

            {/* Floating name badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[var(--color-surface)] border border-[var(--color-accent)]/25 rounded-xl px-5 py-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm md:text-base leading-snug truncate">Prof. H. Ateeq ur Rehman</p>
                <p className="text-[var(--color-accent)] text-xs font-semibold tracking-[0.15em] uppercase mt-0.5">Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
