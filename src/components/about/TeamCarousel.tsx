import Image from "next/image";

const team = [
  {
    name: "Prof. Suleman Rafique",
    role: "Principal",
    bio: "A seasoned educationist and Islamic scholar who steers the academy with principled leadership, ensuring the highest standards of Quranic instruction and student development.",
    image: "/Prof Suleman Rafique .jpeg",
    color: "from-[var(--color-sky)] to-teal-600",
    badge: "bg-[var(--color-sky)]/15 text-[var(--color-sky)] border-[var(--color-sky)]/30",
  },
  {
    name: "Shaikh Abdul Mannan Madni",
    role: "Tafseer & Hadees",
    bio: "A distinguished scholar deeply rooted in classical Islamic sciences, offering students profound insights into Quranic exegesis and the authenticated traditions of the Prophet ﷺ.",
    image: "/Saikh Abdul Mannan Madni.jpeg",
    color: "from-emerald-500 to-green-700",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Qari Arif Bashir",
    role: "Tajweed & Qirat",
    bio: "A certified Qari with mastery in the rules of Tajweed and multiple Qiraat, dedicated to refining every student's recitation with precision, melody, and authentic pronunciation.",
    image: "/Qari Arif Bashir.jpeg",
    color: "from-[var(--color-accent)] to-orange-600",
    badge: "bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30",
  },
  {
    name: "Shaikh Abdul Hannan",
    role: "Asool e Fiqh",
    bio: "An expert in the foundational principles of Islamic jurisprudence, guiding students through the methodology of deriving rulings and understanding the deep roots of Fiqh.",
    image: "/Saikh Abdul Hannan kelani.jpeg",
    color: "from-purple-500 to-violet-700",
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  {
    name: "Prof. Nadeem Younus",
    role: "Academic Coordinator",
    bio: "A meticulous academic professional who oversees curriculum planning, student progress, and teacher coordination to ensure a seamless and enriching learning experience.",
    image: "/Prof Nadeem Younus.jpeg",
    color: "from-blue-500 to-indigo-700",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  {
    name: "Prof. Syed Gulamullah",
    role: "Senior Instructor",
    bio: "A highly experienced instructor bringing years of classroom expertise and scholarly depth, inspiring students to excel in their Quranic studies with dedication and devotion.",
    image: "/Prof Syed Gulamullah.jpeg",
    color: "from-rose-500 to-red-700",
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
];

export default function TeamCarousel() {
  return (
    <section className="relative bg-[var(--color-black-soft)] py-24 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-sky)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            The People Behind the Mission
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Meet Our <span className="text-[var(--color-accent)]">Team</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-sky)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-sky)]" />
          </div>
          <p className="text-gray-400 mt-5 text-base max-w-xl mx-auto leading-relaxed">
            Dedicated scholars and educators committed to guiding every student on their Quranic journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(({ name, role, bio, image, color, badge }, idx) => (
            <div
              key={idx}
              className="group bg-[var(--color-surface-raised)] border border-white/[0.08] rounded-3xl flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-white/15"
            >
              <div className="flex flex-col items-center text-center gap-5 p-8 flex-1">

                {/* Avatar */}
                <div className="relative mt-2">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} blur-md opacity-30 scale-100`} />
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover object-top"
                      sizes="176px"
                    />
                  </div>
                </div>

                {/* Name + badge */}
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-white font-bold text-lg leading-snug">{name}</h3>
                  <span className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${badge}`}>
                    {role}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-10 h-px bg-white/10 rounded-full" />

                {/* Bio */}
                <div className="relative">
                  <span className="absolute -top-3 -left-1 text-5xl leading-none text-white/5 font-serif select-none">&ldquo;</span>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">{bio}</p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
