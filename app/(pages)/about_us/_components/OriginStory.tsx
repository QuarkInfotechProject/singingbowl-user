import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const OriginStory = () => (
  <section className="py-24 md:py-32 px-6 md:px-12">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
      <div className="md:pr-12">
        <Badge className="mb-4 bg-amber-100 border-amber-200 text-amber-800 tracking-wider">
          Our Heritage
        </Badge>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
          From a Sacred Vow to a Living Legacy
        </h2>
        <p className="text-lg text-stone-600 mb-6">
          Singing Bowl Village is one of Kathmandu’s oldest and most respected singing bowl makers, carrying nearly 45 years of tradition, craftsmanship, and cultural heritage. Our factory is located in the peaceful village of Nallu in the Kathmandu district, where our bowls are handcrafted using time-honored techniques passed down through generations.

        </p>
        <blockquote className="border-l-4 border-amber-600 pl-6 italic text-stone-700 text-xl my-8">
          "We do not merely sell bowls. We are custodians of a sound that has
          healed for centuries. It is our duty to protect it."
        </blockquote>
        <p className="text-lg text-stone-600">
          From our beginnings as Kathmandu’s oldest singing bowl store, we have grown steadily—expanding to multiple locations across Thamel, Kathmandu and even internationally, including Bangkok. Despite this growth, our heart remains in Kathmandu , where each bowl continues to be created with the same dedication, skill, and spirit that define our history.

        </p>
      </div>
      <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-xl">
        <Image
          src="/assets/images/home/1.avif"
          alt="Founder of the Himalayan Singing Bowl brand"
          width={500}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  </section>
);

export default OriginStory;
