import Image from "next/image";

export default function AboutHeroAlt() {
  return (
    <section className="relative bg-[var(--color-black-soft)] overflow-hidden py-20 px-4">
      {/* Subtle geometric line backdrop */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-sky) 0px, var(--color-sky) 1px, transparent 1px, transparent 64px)",
        }}
      />
      <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-[var(--color-sky)]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-14 items-center">

        {/* Left — CEO portrait, mirrored to the left side */}
        <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
          <div className="relative w-full max-w-[400px] mt-8 mb-10">

            {/* Rotated accent card behind the photo — dynamic, stacked-photograph feel */}
            <div className="absolute inset-0 rounded-2xl bg-[var(--color-accent)]/90 -rotate-3 pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-sky)]/50 rotate-2 pointer-events-none" />

            {/* Large quote-mark watermark, personal-brand accent */}
            <svg
              className="absolute -top-10 -left-8 w-20 h-20 text-[var(--color-sky)]/25 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>

            {/* Photo card — aspect-[3/4] matches the source image exactly, never cropped */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
              <Image
                src="/Alburhan CEO.jpeg"
                alt="Prof. H. Ateeq ur Rehman — Founder &amp; CEO, AL Burhan Quran Academy"
                fill
                sizes="(max-width: 1024px) 85vw, 400px"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 mix-blend-soft-light bg-gradient-to-t from-[var(--color-accent)]/40 via-transparent to-[var(--color-sky)]/30 pointer-events-none" />
            </div>

            {/* Side name badge — runs along the bottom edge, overlapping the accent card */}
            <div className="absolute -bottom-8 -right-6 bg-[var(--color-surface)] border border-white/10 rounded-xl px-5 py-4 shadow-xl flex items-center gap-3 max-w-[85%]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-sky)]/15 flex items-center justify-center text-[var(--color-sky)] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm md:text-base leading-snug truncate">Prof. H. Ateeq ur Rehman</p>
                <p className="text-[var(--color-sky)] text-xs font-semibold tracking-[0.15em] uppercase mt-0.5">Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — text */}
        <div className="flex flex-col gap-6 order-1 lg:order-2">
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
      </div>
    </section>
  );
}
