import React from "react";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => (
  <section className="relative">
    {/* Hero Image - Smaller height */}
    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/md/bg.jpeg')",
        }}
      />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-stone-50" /> */}
    </div>

    {/* Welcome Message Section - Below the image */}
    <div className="relative bg-stone-50 py-16 md:py-20 px-6 text-center -mt-12 md:-mt-16">
      <div className="max-w-4xl mx-auto">
        <Badge className="mb-6 bg-amber-100 border-amber-200 text-amber-800 px-4 py-2 text-sm font-medium tracking-widest">
          A 600-YEAR TRADITION
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
          Welcome to Our Family
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
          A Sanctuary of Sacred Craftsmanship and Ancestral Healing Wisdom, where every singing bowl carries the soul of the Himalayas.
        </p>
      </div>
    </div>
  </section>
);

export default HeroSection;
