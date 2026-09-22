import AboutHero from "@/components/about/AboutHero";
import TeamCarousel from "@/components/about/TeamCarousel";
import VisionCarousel from "@/components/about/VisionCarousel";
import MissionSection from "@/components/about/MissionSection";
import ValuesSection from "@/components/about/ValuesSection";
import AboutHeroAlt from "@/components/about/AboutHeroAlt";

export const metadata = {
  title: "About Us | AL Burhan Quran Academy",
  description: "Learn about AL Burhan Quran Academy — our mission, vision, and values.",
};

export default function AboutPage() {
  return (
    <>
      {/* <AboutHero /> */}
      <AboutHeroAlt />
      <TeamCarousel />
      <VisionCarousel />
      <MissionSection />
      <ValuesSection />
    </>
  );
}
