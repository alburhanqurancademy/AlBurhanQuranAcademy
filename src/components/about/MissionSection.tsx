export default function MissionSection() {
  return (
    <section className="bg-[var(--color-black-soft)] py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        {/* Left — mission text */}
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Our <span className="text-[var(--color-accent)]">Mission</span>
          </h2>
          <div className="flex flex-col gap-4 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              Our mission is to build a strong and supportive community focused on education, spiritual growth,
              and personal development. We aim to provide high-quality learning opportunities for students of all
              ages, helping them strengthen their understanding of the Quran and Islamic teachings.
            </p>
            <p>
              Beyond education, we strive to support individuals and families by promoting guidance in important
              aspects of life, including personal development, family values, and community well-being. We are
              committed to creating an environment where learners feel supported, motivated, and connected.
            </p>
            <p>
              Inspired by the teachings of the Quran, we encourage individuals to take meaningful steps toward
              improving their knowledge, character, and connection with their faith. Through continuous learning
              and spiritual development, we aim to bring positive and lasting change in both individuals and the
              wider community.
            </p>
          </div>
        </div>

        {/* Right — Arabic verse styled like HadeesSection */}
        <div className="flex items-center justify-center">
          <div className="bg-[var(--color-surface)] rounded-2xl px-8 md:px-14 py-12 flex flex-col items-center gap-5 text-center w-full">
            <p className="arabic text-[var(--color-sky)] text-4xl md:text-6xl leading-loose">
               قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ
            </p>
            <p className="text-white text-base md:text-xl leading-relaxed font-medium">
              &ldquo;Say: Are those who know equal to those who do not know?&rdquo;
            </p>
            <p className="text-[var(--color-sky)] text-lg font-semibold">
              Surah Az-Zumar 39:9
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
