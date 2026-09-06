import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedPosts, getPublishedPostBySlug } from "@/lib/blogsDb";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} | Al Burhan Quran Academy`, description: post.excerpt };
}

const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
  Spirituality:       { border: "border-[var(--color-accent)]/40",      bg: "bg-[var(--color-accent)]/10",  text: "text-[var(--color-accent)]" },
  "Online Learning":  { border: "border-[var(--color-sky)]/40",         bg: "bg-[var(--color-sky)]/10",     text: "text-[var(--color-sky)]" },
  "Faith & Guidance": { border: "border-[var(--color-green-light)]/40", bg: "bg-[var(--color-green)]/10",   text: "text-[var(--color-green-light)]" },
  "Islamic Knowledge":{ border: "border-[var(--color-accent)]/40",      bg: "bg-[var(--color-accent)]/10",  text: "text-[var(--color-accent)]" },
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const c = categoryColors[post.category] ?? categoryColors["Spirituality"];
  // "More Articles" — the latest published blogs, excluding the one being read.
  const allPosts = await getPublishedPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <div className="relative w-full h-[50vh] min-h-[340px] overflow-hidden bg-[var(--color-black-soft)]">
        {/* Plain <img>: admin-uploaded blog images are data URIs, unsupported by next/image */}
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-10">
            <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${c.border} ${c.bg} ${c.text} mb-4`}>
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[var(--color-black)] py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          <article className="flex flex-col gap-8">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Back to Blog
            </Link>

            {post.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-4">
                {section.heading && (
                  <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                    <span className="w-1 h-6 rounded-full bg-[var(--color-accent)] shrink-0" />
                    {section.heading}
                  </h2>
                )}
                <p className="text-gray-300 text-lg leading-relaxed">{section.body}</p>
                {section.list && (
                  <ul className="flex flex-col gap-2 pl-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-300 text-base">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.arabic && (
                  <div className="rounded-2xl border border-[var(--color-sky)]/30 bg-[var(--color-sky)]/5 px-6 py-6 flex flex-col gap-3">
                    <p className="arabic text-2xl text-white text-right leading-loose">{section.arabic}</p>
                    {section.arabicRef && <p className="text-[var(--color-sky)] text-xs font-semibold text-right">﴾ {section.arabicRef} ﴿</p>}
                    {section.translation && <p className="text-gray-400 text-sm leading-relaxed italic border-t border-[var(--color-border)] pt-3">&ldquo;{section.translation}&rdquo;</p>}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-green)]/20 via-[var(--color-surface)] to-[var(--color-accent)]/10 px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <p className="text-white font-bold text-lg">Ready to Start Learning?</p>
                <p className="text-gray-400 text-sm mt-1">Join Al Burhan Quran Academy and begin your Quran journey today.</p>
              </div>
              <Link href="/courses" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm transition-colors shadow-[0_4px_20px_rgba(250,132,30,0.3)]">
                View Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Al Burhan Quran Academy</h3>
              <div className="w-8 h-0.5 bg-[var(--color-accent)] rounded-full" />
              <p className="text-gray-400 text-xs leading-relaxed">Providing authentic Quran education to students worldwide with qualified teachers, flexible schedules, and personalized learning.</p>
              <Link href="/contact" className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-bold transition-colors">Book Trial Class</Link>
            </div>
            {related.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-4">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">More Articles</h3>
                <div className="w-8 h-0.5 bg-[var(--color-accent)] rounded-full" />
                {related.map((rp) => (
                  <Link key={rp.slug} href={`/blogs/${rp.slug}`} className="group flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-black-soft)]">
                      {rp.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rp.image} alt={rp.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-gray-300 text-xs font-semibold leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">{rp.title}</p>
                      <p className="text-gray-500 text-xs">{rp.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
