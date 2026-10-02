import TeamHero from "@/components/team/TeamHero";
import TeamSection from "@/components/team/TeamSection";

export const metadata = {
  title: "Our Team | Al Burhan Quran Academy",
  description:
    "Meet the scholars and educators of Al Burhan Quran Academy — the people guiding every student on their Quranic journey.",
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamSection />
    </>
  );
}
