import BlogHero from "@/components/blogs/BlogHero";

export default function BlogsLoading() {
  return (
    <>
      <BlogHero />

      <section className="bg-[var(--color-black)] pt-14 pb-20 px-4" aria-busy="true" aria-label="Loading blogs">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Featured card */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="grid lg:grid-cols-2">
              <div className="h-64 lg:h-auto min-h-[320px] bg-[var(--color-black-soft)]" />
              <div className="p-8 lg:p-10 flex flex-col justify-center gap-4">
                <div className="h-6 w-28 rounded-full bg-[var(--color-black-soft)]" />
                <div className="h-8 w-4/5 rounded bg-[var(--color-black-soft)]" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
                  <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
                  <div className="h-3 w-2/3 rounded bg-[var(--color-black-soft)]" />
                </div>
                <div className="h-3 w-40 rounded bg-[var(--color-black-soft)]" />
                <div className="h-4 w-32 rounded bg-[var(--color-black-soft)]" />
              </div>
            </div>
          </div>

          {/* Grid cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                <div className="h-52 bg-[var(--color-black-soft)]" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-5 w-11/12 rounded bg-[var(--color-black-soft)]" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
                    <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--color-black-soft)]" />
                  </div>
                  <div className="h-3 w-36 rounded bg-[var(--color-black-soft)] mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
