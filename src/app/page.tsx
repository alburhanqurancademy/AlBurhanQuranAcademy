import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import HadeesSection from "@/components/HadeesSection";
import StatsSection from "@/components/StatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import FloatingContact from "@/components/FloatingContact";

export default function Home() {
  return (
    <>
      <Header />
      <Banner />
      <StatsSection />
      <WhyChooseUs />
      <HadeesSection />
      <Footer />
      <FloatingContact />
    </>
  );
}