"use client";

import Image from "next/image";
import Link from "next/link";
import { DownloadCategory } from "@/lib/downloadsData";

export default function CategoryPdfs({ category }: { category: DownloadCategory }) {
  return (
    <section className="bg-[var(--color-black)] min-h-screen">

      {/* Hero banner — full-width image cover like blog detail */}
      <div className="relative w-full h-[20vh] min-h-[340px] overflow-hidden">
        <Image src={category.image} alt={category.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-10">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <Link href="/downloads" className="hover:text-[var(--color-accent)] transition-colors">Downloads</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{category.name}</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent)] text-white mb-3">{category.tag}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl">
              {category.name}
            </h1>
            <p className="text-gray-300 text-sm mt-3 max-w-xl leading-relaxed">{category.description}</p>
          </div>
        </div>
      </div>

      {/* PDF List */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {category.pdfs.map((pdf, index) => (
            <Link
              key={pdf.id}
              href={`/downloads/${category.id}/${pdf.id}`}
              className="group flex items-center gap-4 bg-[var(--color-surface)] border-2 border-[var(--color-sky)]/20 hover:border-orange-500/40 rounded-2xl px-5 py-4 transition-all duration-300"
            >
              {/* PDF Icon Block */}
              <div className="flex-shrink-0 w-14 h-16 bg-white rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="flex-1 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="bg-orange-500 text-white text-[10px] font-bold text-center py-1 tracking-wider">
                  PDF
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                {/* Badge + number row */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full tracking-wider">
                    PDF
                  </span>
                  <span className="text-xs text-gray-500">#{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h3 className="text-white font-bold text-sm leading-snug group-hover:text-orange-400 transition-colors truncate">
                  {pdf.name}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed line-clamp-1">{pdf.description}</p>

                {/* Pages */}
                <div className="flex items-center gap-1 mt-1.5">
                  <svg className="w-3 h-3 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-gray-500 text-xs">{pdf.pages}</span>
                </div>
              </div>

              {/* Arrow Button */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
