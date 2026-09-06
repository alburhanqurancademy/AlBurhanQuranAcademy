import Link from "next/link";
import { getPublishedPosts } from "@/lib/blogsDb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Al Burhan Quran Academy",
  description: "Read our latest articles on Quran learning, Islamic guidance, and spiritual growth.",
};

const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
  Spirituality:       { border: "border-[var(--color-accent)]/40",      bg: "bg-[var(--color-accent)]/10",      text: "text-[var(--color-accent)]" },
  "Online Learning":  { border: "border-[var(--color-sky)]/40",         bg: "bg-[var(--color-sky)]/10",         text: "text-[var(--color-sky)]" },
  "Faith & Guidance": { border: "border-[var(--color-green-light)]/40", bg: "bg-[var(--color-green)]/10",       text: "text-[var(--color-green-light)]" },
  "Islamic Knowledge":{ border: "border-[var(--color-accent)]/40",      bg: "bg-[var(--color-accent)]/10",      text: "text-[var(--color-accent)]" },
};

export default async function BlogPage() {
  // Newest first — the most recently created blog is always the featured one on top.
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="bg-[var(--color-black)] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 rounded-full mb-4">
            Our Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Insights & <span className="text-[var(--color-accent)]">Guidance</span>
          </h1>
          <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            Articles on Quran learning, Islamic knowledge, and spiritual growth for every Muslim.
          </p>
        </div>

        {!featured ? (
          <p className="text-center text-gray-400 text-sm py-16">No articles published yet. Check back soon!</p>
        ) : (
          <>
            <Link href={`/blogs/${featured.slug}`} className="group block mb-12">
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300 bg-[var(--color-surface)]">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden bg-[var(--color-black-soft)]">
                    {/* Plain <img>: admin-uploaded blog images are data URIs, unsupported by next/image */}
                    {featured.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-surface)] hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[var(--color-accent)] rounded-full px-3 py-1 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-xs font-bold">Featured</span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col justify-center gap-4">
                    {(() => {
                      const c = categoryColors[featured.category] ?? categoryColors["Spirituality"];
                      return <span className={`self-start text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${c.border} ${c.bg} ${c.text}`}>{featured.category}</span>;
                    })()}
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">{featured.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{featured.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{featured.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mt-2 group-hover:gap-3 transition-all duration-200">
                      Read Article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => {
                const c = categoryColors[post.category] ?? categoryColors["Spirituality"];
                return (
                  <Link key={post.slug} href={`/blogs/${post.slug}`} className="group flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(250,132,30,0.1)]">
                    <div className="relative h-52 overflow-hidden bg-[var(--color-black-soft)]">
                      {post.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${c.border} ${c.bg} ${c.text} backdrop-blur-sm`}>{post.category}</span>
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <h3 className="text-white font-black text-lg leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{post.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span>{post.readTime}</span>
                        </div>
                        <span className="text-[var(--color-accent)] group-hover:translate-x-1 transition-transform duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
