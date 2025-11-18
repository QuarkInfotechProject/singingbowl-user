import React from "react";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => (
  <section className="relative h-[90vh] md:h-screen overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-80"
      style={{
        backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')",
      }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/20 to-transparent"></div>
    <div className="relative h-full flex flex-col items-center justify-end pb-24 md:pb-32 text-stone-900 px-6 text-center">
      <Badge className="mb-6 bg-white/80 border-stone-200 text-stone-700 px-4 py-2 text-sm font-medium tracking-widest backdrop-blur-sm">
        A 600-YEAR TRADITION
      </Badge>
      <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 max-w-4xl leading-tight tracking-tight">
        Echoes of the Himalayas
      </h1>
      <p className="text-xl md:text-2xl font-light max-w-3xl text-stone-800">
        A Sanctuary of Sacred Craftsmanship and Ancestral Healing Wisdom
      </p>
    </div>
  </section>
);

export default HeroSection;
