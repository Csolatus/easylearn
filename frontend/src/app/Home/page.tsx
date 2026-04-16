import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a] text-white">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
}
