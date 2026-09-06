import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";

export const metadata = {
  title: "Contact Us | Al Burhan Quran Academy",
  description: "Book a trial Quran class with Al Burhan Quran Academy.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
    </>
  );
}
