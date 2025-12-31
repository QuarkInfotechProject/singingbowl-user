import React from "react";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";

const ChairmanMessage = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 bg-stone-100 border-y border-stone-200">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
      <div className="md:w-2/5 flex-shrink-0 flex flex-col items-center">
        <Image
          src="/assets/images/md/4.avif"
          alt="Chairman Narendra Lama"
          width={192}
          height={192}
          className="w-48 h-48 md:w-120 md:h-120 object-cover rounded-3xl mx-auto shadow-xl border-4 border-white"
        />
        <div className="mt-6 text-center">
          <p className="text-2xl font-serif font-semibold text-stone-800">
            Mr. Narendra Lama
          </p>
          <p className="text-amber-800">Chairman</p>
        </div>
      </div>
      <div className="md:w-3/5 text-center md:text-left">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          A Message From Our Chairman
        </Badge>
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">
          Carrying the Flame Forward
        </h2>
        <p className="text-md text-stone-600 leading-relaxed ">
          I am Narendra Lama, the visionary chairman behind our esteemed singing bowl company. My journey began with a deep-rooted passion for preserving and sharing the rich cultural heritage of Himalayan singing bowls, inspired by a profound appreciation for these ancient instruments and their spiritual significance.
        </p>
        <p className="text-md text-stone-600 leading-relaxed mt-4">
          Through dedication and years of experience, I have cultivated a company grounded in craftsmanship, authenticity, and the transformative power of sound healing. My leadership is driven by a commitment to honoring tradition while continuously exploring innovative approaches to creating and curating singing bowls.
        </p>
        <p className="text-md text-stone-600 leading-relaxed mt-4">
          Each bowl we create reflects quality, spiritual depth, and intention. My vision continues to guide our work as we uphold ancient practices and embrace new possibilities in the realm of holistic well-being, ensuring that the essence of Himalayan singing bowls resonates across generations.
        </p>
      </div>
    </div>
  </section>
);

export default ChairmanMessage;
