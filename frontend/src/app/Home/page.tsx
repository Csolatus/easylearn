import Header from "@/components/layout/Header";
import HeroSection from "./HeroSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a] text-white">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}
