import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { SiteContactProvider } from "@/components/SiteContactProvider";
import { getSiteContact } from "@/lib/siteContactServer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSiteContact();

  return (
    <SiteContactProvider value={contact}>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
    </SiteContactProvider>
  );
}
