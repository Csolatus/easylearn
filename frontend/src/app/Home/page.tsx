import Header from "@/components/layout/Header";
import HomeHeroSection from "./HomeHeroSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <HomeHeroSection />
      <Footer />
    </div>
  );
}
