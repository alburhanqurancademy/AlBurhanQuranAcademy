export default function ContactHero() {
  return (
    <section className="bg-[var(--color-black-soft)] py-16 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[var(--color-sky)]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--color-accent)]/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>


      {/* Header */}
      <div className="text-center">
        <p className="text-[var(--color-sky)] text-xs tracking-widest uppercase font-semibold mb-3">Get In Touch</p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Book a <span className="text-[var(--color-accent)]">Trial</span> Class
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Fill in the form below and one of our teachers will reach out to schedule your trial class at a time that suits you.
        </p>
      </div>

    </section>
  );
}
