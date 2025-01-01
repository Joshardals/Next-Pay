import { Header } from "./_components/shared/Header";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedIn } from "./_components/FeaturedIn";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[104px] pb-20 px-4 sm:px-8 md:px-20 max-w-7xl mx-auto min-h-screen  space-y-14 ">
        <HeroSection />
        <FeaturedIn />
      </main>
    </>
  );
}
