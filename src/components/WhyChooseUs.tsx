const features = [
  {
    title: "Free Trial Classes",
    desc: "Start your journey risk-free with a complimentary trial class before you commit.",
  },
  {
    title: "Special Focus on Slow Learners",
    desc: "Our teachers adapt their pace to every student, ensuring no one is left behind.",
  },
  {
    title: "Online Quran Memorization",
    desc: "Structured Hifz program with expert guidance to help students memorize the Holy Quran.",
  },
  {
    title: "Expert Teachers with English Fluency",
    desc: "Qualified and experienced Quran teachers who communicate clearly in English for better understanding.",
  },
    {
    title: "Female Teachers for Women",
    desc: "Dedicated female Quran teachers available for sisters and young girls in a comfortable environment.",
  },
  {
    title: "Monthly Progress Assessment",
    desc: "Regular feedback and assessments keep students and parents informed of learning milestones.",
  },
  {
    title: "Flexible Timings That Suit You",
    desc: "Choose class timings that fit your daily routine — whether at home or traveling.",
  },
  {
    title: "Diverse Islamic & Quranic Courses",
    desc: "From Tajweed to Islamic studies — a wide range of courses tailored to every level and age.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[var(--color-black)] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[var(--color-accent)] uppercase tracking-[0.3em] text-sm font-semibold mb-2">
            Our Commitment
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Why Choose <span className="text-[var(--color-accent)]">Us?</span>
          </h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto rounded-full mb-8" />
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            AL Burhan Quran Academy is committed to providing quality Quran education to Muslims around the world.
            Our mission is to help students develop a strong connection with the Holy Quran and understand the true
            teachings of Islam in a simple and effective way.
          </p>
        </div>

        {/* Full-width: image behind + dark overlay + text on top */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src="/whyChooseUs.jpeg" alt="Why Choose Al Burhan Quran Academy" className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 px-8 py-12 md:px-16 flex flex-col gap-8">

            {/* Description */}
            <div className="space-y-4 text-gray-300 text-base leading-relaxed max-w-3xl">
              <p>
                AL Burhan Quran Academy is committed to providing quality Quran education to Muslims around the
                world. Our mission is to help students develop a strong connection with the Holy Quran and understand the
                true teachings of Islam in a simple and effective way.
              </p>
              <p>
                At AL Burhan Quran Academy, we follow a structured and step-by-step learning approach that enables
                students of all ages to learn the Quran correctly with proper Tajweed. Our goal is not only to teach Quran
                recitation but also to help students build confidence and consistency in their learning journey.
              </p>
              <p>
                Our online learning system allows students to take Quran classes from the comfort of their homes. With
                flexible scheduling, you can easily choose class timings that fit your daily routine. Whether you are at home
                or traveling with your family, our online platform keeps you connected with your Quran lessons without
                interruption.
              </p>
              <p>
                Our qualified and experienced Quran teachers are dedicated to guiding every student with patience and
                care. They understand the importance of time and maintain punctuality in every class to ensure a smooth
                and reliable learning experience.
              </p>
              <p>
                By joining AL Burhan Quran Academy, students receive personal attention, structured guidance, and a
                supportive learning environment that helps them improve their Quran recitation and understanding. With
                regular practice and expert guidance, students can soon read the Holy Quran with confidence and fluency.
              </p>
            </div>

            {/* Bullet list */}
            <ul className="grid grid-cols-2 gap-x-3 gap-y-3 max-w-lg">
              {features.map(({ title }) => (
                <li key={title} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                  <span className="text-white font-semibold text-sm">{title}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>

      </div>
    </section>
  );
}
