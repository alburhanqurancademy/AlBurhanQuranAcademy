import { notFound } from "next/navigation";
import CategoryPdfs from "@/components/downloads/CategoryPdfs";
import { downloadsData } from "@/lib/downloadsData";

export function generateStaticParams() {
  return downloadsData.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = downloadsData.find((c) => c.id === category);
  if (!cat) return {};
  return { title: `${cat.name} | Downloads | Al Burhan Quran Academy`, description: cat.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = downloadsData.find((c) => c.id === category);
  if (!cat) notFound();
  return <CategoryPdfs category={cat} />;
}
