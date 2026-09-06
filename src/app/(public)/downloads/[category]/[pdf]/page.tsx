import { notFound } from "next/navigation";
import PdfViewer from "@/components/downloads/PdfViewer";
import { downloadsData } from "@/lib/downloadsData";

export function generateStaticParams() {
  return downloadsData.flatMap((cat) => cat.pdfs.map((pdf) => ({ category: cat.id, pdf: pdf.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; pdf: string }> }) {
  const { category, pdf: pdfId } = await params;
  const cat = downloadsData.find((c) => c.id === category);
  const pdf = cat?.pdfs.find((p) => p.id === pdfId);
  if (!pdf) return {};
  return { title: `${pdf.name} | Al Burhan Quran Academy`, description: pdf.description };
}

export default async function PdfPage({ params }: { params: Promise<{ category: string; pdf: string }> }) {
  const { category, pdf: pdfId } = await params;
  const cat = downloadsData.find((c) => c.id === category);
  const pdf = cat?.pdfs.find((p) => p.id === pdfId);
  if (!cat || !pdf) notFound();
  return <PdfViewer category={cat} pdf={pdf} />;
}
