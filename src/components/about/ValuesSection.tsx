const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    heading: "Knowledge",
    text: "We strongly believe that knowledge has the power to transform both individuals and communities. Our foundation is built on authentic Islamic education, helping students develop a clear and meaningful understanding of the Quran and its teachings.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    heading: "Community",
    text: "We are committed to building a positive and supportive learning environment where students feel valued, respected, and connected. Our aim is to create a community that encourages mutual respect, understanding, and growth.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-4.5 0 2.625 2.625 0 015.25 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    heading: "Self-Improvement",
    text: "We promote continuous self-development and spiritual growth. Our goal is to inspire individuals to improve their character, strengthen their faith, and make a positive impact in their daily lives and society.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-[var(--color-black)] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Our <span className="text-[var(--color-accent)]">Values</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {values.map(({ icon, heading, text }) => (
            <div
              key={heading}
              className="group bg-[var(--color-surface)] border border-[var(--color-sky)]/15 rounded-2xl p-8 flex flex-col gap-4 transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/5 hover:shadow-[0_0_30px_rgba(250,132,30,0.12)] hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--color-sky)]/10 border border-[var(--color-sky)]/20 flex items-center justify-center text-[var(--color-sky)] transition-all duration-300 group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/30 group-hover:text-[var(--color-accent)]">
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                {heading}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
