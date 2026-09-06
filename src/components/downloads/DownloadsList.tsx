import Image from "next/image";
import Link from "next/link";
import { downloadsData } from "@/lib/downloadsData";

export default function DownloadsList() {
  return (
    <section className="bg-[var(--color-black)] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1 h-8 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-sky)] rounded-full" />
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Browse</p>
            <h2 className="text-white font-black text-2xl">All Collections</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {downloadsData.map((cat) => (
            <Link
              key={cat.id}
              href={`/downloads/${cat.id}`}
              className="group relative bg-[var(--color-surface)] rounded-2xl overflow-hidden border-2 border-[var(--color-sky)]/20 hover:border-orange-500/60 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/20 to-transparent" />


              </div>

              {/* Name overlay at bottom */}
              <div className="p-5 flex items-center justify-between">
                <h3 className="text-white font-black text-base group-hover:text-[var(--color-accent)] transition-colors duration-300 leading-tight">
                  {cat.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all duration-300 shrink-0">
                  <svg className="w-4 h-4 text-[var(--color-accent)] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>


            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
