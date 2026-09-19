import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative bg-[var(--color-black-soft)] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[var(--color-sky)]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:min-h-[640px]">

        {/* Left — text */}
        <div className="relative z-10 flex flex-col gap-6 justify-center w-full lg:w-[54%] shrink-0 px-4 sm:px-8 lg:pl-16 xl:pl-24 lg:pr-12 py-14 lg:py-24">
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

        {/* Right — full-bleed CEO portrait, blended into the background */}
        <div className="relative w-full h-[420px] sm:h-[480px] lg:h-auto lg:flex-1">
          <Image
            src="/Alburhan CEO.jpeg"
            alt="Prof. H. Ateeq ur Rehman — Founder &amp; CEO, AL Burhan Quran Academy"
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover object-top"
            priority
          />

          {/* Brand-tinted grade for a cohesive, professional finish */}
          <div className="absolute inset-0 mix-blend-soft-light bg-gradient-to-br from-[var(--color-sky)]/70 via-transparent to-[var(--color-accent)]/60" />
          <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-t from-black/40 via-transparent to-black/10" />

          {/* Seam blend — fades the photo into the section background */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--color-black-soft)] to-transparent pointer-events-none" />
          <div className="lg:hidden absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--color-black-soft)]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-black-soft)] via-[var(--color-black-soft)]/50 to-transparent pointer-events-none" />

          {/* Name badge */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs backdrop-blur-md bg-black/40 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] shrink-0">
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
    </section>
  );
}
