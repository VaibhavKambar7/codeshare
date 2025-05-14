"use client";

import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import FAQs from "./_components/FAQs";
import Footer from "./_components/Footer";

export default function Component() {
  return (
    <div className="cursor:default relative flex min-h-screen flex-col bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] text-black">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <FAQs />
      </main>
      <Footer />
    </div>
  );
}
