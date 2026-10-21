export default function BlogDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading article" className="animate-pulse">
      <div className="relative w-full h-[50vh] min-h-[340px] bg-[var(--color-black-soft)]">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-10">
            <div className="h-6 w-28 rounded-full bg-[var(--color-surface)] mb-4" />
            <div className="h-10 w-full max-w-3xl rounded bg-[var(--color-surface)]" />
            <div className="h-4 w-48 rounded bg-[var(--color-surface)] mt-4" />
          </div>
        </div>
      </div>

      <section className="bg-[var(--color-black)] py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          <div className="flex flex-col gap-8">
            <div className="h-4 w-28 rounded bg-[var(--color-black-soft)]" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-7 w-1/2 rounded bg-[var(--color-black-soft)]" />
                <div className="h-4 w-full rounded bg-[var(--color-black-soft)]" />
                <div className="h-4 w-full rounded bg-[var(--color-black-soft)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-black-soft)]" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
            <div className="h-4 w-3/4 rounded bg-[var(--color-black-soft)]" />
            <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
            <div className="h-3 w-full rounded bg-[var(--color-black-soft)]" />
            <div className="h-9 w-full rounded-xl bg-[var(--color-black-soft)] mt-1" />
          </div>
        </div>
      </section>
    </div>
  );
}
