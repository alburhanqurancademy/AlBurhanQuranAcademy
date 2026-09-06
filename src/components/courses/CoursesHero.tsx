import Image from "next/image";

export default function CoursesHero() {
  return (
    <section className="bg-[var(--color-black-soft)] py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        {/* Left — text */}
        <div className="flex flex-col gap-6">
          {/* <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            In <span className="text-[var(--color-accent)]">Courses</span>
          </h1> */}
          <p className="text-gray-300 text-base md:text-xl leading-relaxed">
            <span className="text-[var(--color-accent)]">Al Burhan Quran Academy</span> offers a variety of Quranic and
            Islamic courses tailored to meet the needs of every student. Our qualified male and female teachers are
            fluent in English and guide students step by step, focusing on proper Tajweed and accurate Quran recitation.
            We understand that each student learns differently, so our teaching approach is flexible, allowing everyone
            to progress at their own pace and build a strong foundation in Quran learning.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Understanding the busy lifestyles of families in the USA and Canada, we provide fully online classes that
            allow students to learn from the comfort of their homes. Our courses are designed to be convenient,
            interactive, and engaging, using modern tools like Zoom, Teams, and Skype to ensure effective communication
            between teachers and students.
          </p>
        </div>

        {/* Right — image with decorations */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[520px]">

            {/* Dot grid background */}
            <div
              className="absolute -top-6 -left-6 w-32 h-32 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-sky) 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-accent) 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Ambient glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--color-sky)]/20 via-transparent to-[var(--color-accent)]/20 blur-2xl" />

            {/* Main image card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              <Image
                src="/courseBanner.jpeg"
                alt="Quran Courses"
                width={540}
                height={400}
                className="object-cover w-full h-[360px] md:h-[420px]"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

              {/* Bottom label inside image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-end">
                {/* <div>
                  <p className="text-white font-black text-lg leading-tight">Al Burhan Quran Academy</p>
                  <p className="text-[var(--color-sky)] text-xs tracking-widest uppercase mt-0.5">Online Quran Learning</p>
                </div> */}
                {/* Live badge */}
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-xs font-semibold">Live Classes</span>
                </div>
              </div>
            </div>

            {/* Floating stat card — top right */}
            <div className="absolute -top-5 -right-5 bg-[var(--color-surface)] border border-[var(--color-sky)]/20 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-sky)]/10 flex items-center justify-center text-[var(--color-sky)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-sm">6+ Courses</p>
                <p className="text-gray-400 text-xs">Available Now</p>
              </div>
            </div>

            {/* Floating stat card — bottom left */}
            <div className="absolute -bottom-5 -left-5 bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-sm">500+ Students</p>
                <p className="text-gray-400 text-xs">Worldwide</p>
              </div>
            </div>
 
            {/* Corner accent lines */}
            <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-[var(--color-sky)]/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-[var(--color-accent)]/60 rounded-br-xl pointer-events-none" />

          </div>
        </div>

      </div>
    </section>
  );
}
