import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="bg-[var(--color-black-soft)] py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        {/* Left — text */}
        <div className="flex flex-col gap-6">
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

        <div className="flex justify-center">
          <div className="relative w-72 md:w-80 rounded-3xl overflow-hidden">
            <Image
              src="/ateeq.png"
              alt="Prof. H. Ateeq ur Rehman"
              width={320}
              height={420}
              className="w-full h-[420px] object-cover object-top"
            />
            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 py-6">
              <div className="w-10 h-[2px] bg-[var(--color-accent)] mb-3" />
              <p className="text-white text-xl font-bold leading-snug">Prof. H. Ateeq ur Rehman</p>
              <p className="text-[var(--color-accent)] text-xs font-semibold tracking-[0.18em] uppercase mt-1">Founder &amp; CEO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
