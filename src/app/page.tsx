import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { CertificatesSection } from "@/components/sections/certificates";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TabletFloatingNav } from "@/components/tablet-nav";
import { CustomCursor } from "@/components/custom-cursor";
import { StyleSwitcher } from "@/components/style-switcher";
import { SectionReveal } from "@/components/section-reveal";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <CertificatesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
      <TabletFloatingNav />
      <StyleSwitcher />
    </div>
  );
}
