import FaqHero from "@/components/faq/FaqHero";
import FaqSection from "@/components/faq/FaqSection";

export const metadata = {
  title: "FAQs | Al Burhan Quran Academy",
  description: "Frequently asked questions about our Quran courses, teachers, and online classes.",
};

export default function FaqPage() {
  return (
    <>
      <FaqHero />
      <FaqSection />
    </>
  );
}
